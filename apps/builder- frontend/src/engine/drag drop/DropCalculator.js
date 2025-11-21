{
  targetId: <string|null>,   // id of container node where the dragged node should be placed (or null = drop rejected)
  insertIndex: <number>,     // index within target.children to insert at
  position: 'before'|'after' // whether the dragged node should be placed before/after nearest child (helps UI)
}



// engine/dragdrop/DropCalculator.js
//
// DropCalculator:
//  - calculateDropFromDOM(domRoot, pointer, draggingNodeId)
//  - calculateDropFromVirtual(nodes, pointer, draggingNodeId)
//
// Both helpers return:
//  { targetId: string|null, insertIndex: number, position: 'before'|'after' }

export function _distance(x1, y1, x2, y2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * DOM-based drop calculation.
 *
 * domRoot: root DOM element containing canvas output
 * pointer: { x: number, y: number } client coordinates (pageX/pageY or clientX/clientY)
 * draggingNodeId: id of the node being dragged (string) - used to ignore its own box
 *
 * Returns { targetId, insertIndex, position }
 */
export function calculateDropFromDOM(domRoot, pointer, draggingNodeId = null) {
  if (!domRoot) return { targetId: null, insertIndex: -1, position: null };

  // gather candidate containers: elements with data-node-id attribute
  const elems = Array.from(domRoot.querySelectorAll('[data-node-id]'));

  // map to bounding rects
  const candidates = elems.map(el => {
    const rect = el.getBoundingClientRect();
    return {
      id: el.getAttribute('data-node-id'),
      el,
      rect,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
      isContainer: el.getAttribute('data-node-is-container') === 'true' // optional marker
    };
  }).filter(c => c.id !== draggingNodeId); // exclude dragged element itself when present in DOM

  if (candidates.length === 0) return { targetId: null, insertIndex: -1, position: null };

  // find nearest candidate center to pointer
  let best = null;
  let bestDist = Infinity;
  for (const c of candidates) {
    // prefer container elements (marked) if present; otherwise all nodes considered
    const d = _distance(pointer.x, pointer.y, c.centerX, c.centerY);
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }

  if (!best) return { targetId: null, insertIndex: -1, position: null };

  // If the target element is a container (has children), compute insertion index by vertical position
  let insertIndex = 0;
  let position = 'after';
  if (best.isContainer) {
    const children = Array.from(best.el.children).filter(ch => ch.hasAttribute('data-node-id'));
    if (children.length === 0) {
      insertIndex = 0;
      position = 'after';
    } else {
      // Find nearest child by vertical (y) position
      let nearestChild = null;
      let nearestDist = Infinity;
      for (let i = 0; i < children.length; i++) {
        const ch = children[i];
        if (ch.getAttribute('data-node-id') === draggingNodeId) continue;
        const r = ch.getBoundingClientRect();
        const childCenterY = r.top + r.height / 2;
        const d = Math.abs(pointer.y - childCenterY);
        if (d < nearestDist) {
          nearestDist = d;
          nearestChild = { el: ch, index: i, rect: r };
        }
      }
      if (!nearestChild) {
        // fallback to append
        insertIndex = children.length;
        position = 'after';
      } else {
        // decide before/after depending on pointer being above or below child center
        if (pointer.y < (nearestChild.rect.top + nearestChild.rect.height / 2)) {
          insertIndex = nearestChild.index;
          position = 'before';
        } else {
          insertIndex = nearestChild.index + 1;
          position = 'after';
        }
      }
    }
  } else {
    // If best element is not explicitly a container, consider placing sibling next to it
    insertIndex = 0;
    position = 'after';
    const parent = best.el.parentElement;
    if (parent && parent.hasAttribute('data-node-id')) {
      const siblings = Array.from(parent.children).filter(ch => ch.hasAttribute('data-node-id'));
      let idx = siblings.findIndex(s => s.getAttribute('data-node-id') === best.id);
      if (idx < 0) idx = siblings.length;
      // place after or before based on pointer x/y relative to element center
      if (pointer.y < best.rect.top + best.rect.height / 2) {
        insertIndex = idx;
        position = 'before';
      } else {
        insertIndex = idx + 1;
        position = 'after';
      }
      return {
        targetId: parent.getAttribute('data-node-id'),
        insertIndex,
        position
      };
    }
  }

  return { targetId: best.id, insertIndex, position };
}

/**
 * Virtual drop calculation (no DOM).
 *
 * nodes: array of top-level virtual nodes. Each node optionally has:
 *        { id, rect: { x,y,width,height } , children: [...] }
 * pointer: { x, y } in the same coordinate space as the rects
 * draggingNodeId: id to ignore (optional)
 *
 * This uses distance to centers and basic containment to pick target container.
 */
export function calculateDropFromVirtual(nodes, pointer, draggingNodeId = null) {
  // flatten nodes with their rects
  const flat = [];
  const walk = (node, parentId = null) => {
    if (node.id === draggingNodeId) return; // ignore dragged node
    if (node.rect) {
      flat.push({
        id: node.id,
        rect: node.rect,
        parentId,
        node
      });
    }
    if (node.children?.length) {
      for (const child of node.children) walk(child, node.id);
    }
  };
  for (const n of nodes) walk(n, null);

  if (flat.length === 0) return { targetId: null, insertIndex: -1, position: null };

  // find containers (nodes with children) first that contain the pointer
  const containersContaining = flat.filter(f => {
    const r = f.rect;
    return pointer.x >= r.x && pointer.x <= r.x + r.width && pointer.y >= r.y && pointer.y <= r.y + r.height &&
           (f.node.children && f.node.children.length >= 0);
  });

  if (containersContaining.length > 0) {
    // pick smallest container (most specific)
    containersContaining.sort((a, b) => (a.rect.width * a.rect.height) - (b.rect.width * b.rect.height));
    const target = containersContaining[0].node;
    // compute insert index by comparing pointer.y to child centers (if child rects exist)
    if (!target.children || target.children.length === 0) {
      return { targetId: target.id, insertIndex: 0, position: 'after' };
    }
    // if child rects available, pick insert index
    const childRects = target.children
      .map((c, i) => ({ child: c, index: i, rect: c.rect }))
      .filter(c => c.rect); // only those with rects
    if (childRects.length === 0) {
      return { targetId: target.id, insertIndex: target.children.length, position: 'after' };
    }
    let nearest = null;
    let minD = Infinity;
    for (const cr of childRects) {
      const cy = cr.rect.y + cr.rect.height / 2;
      const d = Math.abs(pointer.y - cy);
      if (d < minD) {
        minD = d;
        nearest = cr;
      }
    }
    if (!nearest) {
      return { targetId: target.id, insertIndex: target.children.length, position: 'after' };
    }
    if (pointer.y < (nearest.rect.y + nearest.rect.height / 2)) {
      return { targetId: target.id, insertIndex: nearest.index, position: 'before' };
    } else {
      return { targetId: target.id, insertIndex: nearest.index + 1, position: 'after' };
    }
  }

  // fallback: choose nearest node center as sibling (place after)
  let best = null;
  let bestDist = Infinity;
  for (const f of flat) {
    const cx = f.rect.x + f.rect.width / 2;
    const cy = f.rect.y + f.rect.height / 2;
    const d = _distance(pointer.x, pointer.y, cx, cy);
    if (d < bestDist) {
      bestDist = d;
      best = f;
    }
  }
  if (!best) return { targetId: null, insertIndex: -1, position: null };

  // insert into best.parentId if present, otherwise make it top-level
  if (best.parentId) {
    // find index in parent's children order (requires parent data)
    const parent = _findNodeById(nodes, best.parentId);
    if (parent && parent.children) {
      const idx = parent.children.findIndex(c => c.id === best.id);
      const pos = (pointer.y < (best.rect.y + best.rect.height / 2)) ? 'before' : 'after';
      return {
        targetId: parent.id,
        insertIndex: pos === 'before' ? idx : idx + 1,
        position: pos
      };
    }
  }

  // no parent: place top-level after the best node
  return { targetId: null, insertIndex: -1, position: null };
}

// small helper to find node in tree by id (for virtual)
function _findNodeById(nodes, id) {
  const walk = (list) => {
    for (const n of list) {
      if (n.id === id) return n;
      if (n.children) {
        const found = walk(n.children);
        if (found) return found;
      }
    }
    return null;
  };
  return walk(nodes);
}
