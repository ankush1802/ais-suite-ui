
export function GlobalTreeSearch(nodes: any[],value: any, key = 'key', reverse = false) {
    const stack = [nodes[0]];
    while (stack.length) {
        const node = stack[reverse ? 'pop' : 'shift']();
        if (node[key] === value) return node;
        node.children && stack.push(...node.children);
    }
    return null;
}
