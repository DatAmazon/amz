export function treeToList(tree: any[], key: any, collection: any[]) {
    for (var j = 0; j < tree.length; j++) {
        var children = tree[j][key];
        collection.push(tree[j]);
        if (children.length > 0) {
            for (var i = 0; i < children.length; i++) {
                collection.push(children[i]);
            }
        }
    }
    return;
}

export function base64ToArrayBuffer(base64: string) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}