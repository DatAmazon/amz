const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

const filterGrid = (searchParams) => {
    var response = {};
    Object.entries(searchParams).forEach(entry => {
        const [key, value] = entry;
        if (value) response[key] = value;
    });
    return response;
};

const listToTree = (data, options) => {
    options = options || {};
    var ID_KEY = options.idKey || 'id';
    var PARENT_KEY = options.parentKey || 'parentId';
    var CHILDREN_KEY = options.childrenKey || 'data';

    var tree = [], childrenOf = {};
    var item, id, parentId;

    for (var i = 0, length = data.length; i < length; i++) {
        item = data[i];
        id = item[ID_KEY];
        parentId = item[PARENT_KEY] || 0;
        // every item may have children
        childrenOf[id] = childrenOf[id] || [];
        // init its children
        item[CHILDREN_KEY] = childrenOf[id];
        if (parentId !== 0) {
            // init its parent's children object
            childrenOf[parentId] = childrenOf[parentId] || [];
            // push it into its parent's children object
            childrenOf[parentId].push(item);
        } else {
            tree.push(item);
        }
    };
    return tree;
};

const fmDate = (day) => {
    let yyyy = day.getFullYear();
    let mm = day.getMonth() + 1; // Months start at 0!
    let dd = day.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return dd.toString() + mm.toString() + yyyy.toString();
}
const getDbName = () => {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const first = fmDate(firstDay);
    const last = fmDate(lastDay);
    return 'mtvan_' + first + '_' + last;
}

module.exports = { getPagination, filterGrid, listToTree, getDbName };