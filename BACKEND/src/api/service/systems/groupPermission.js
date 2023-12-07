const { omit } = require('lodash');
const groupPermission = require('../../models/systems/groupPermission');
exports.get = async (id) => {
    if (!id) {
        return groupPermission.find();
    }
    return groupPermission.findOne({ code: id });
}

exports.create = async (groupDto) => {
    const newGroup = new groupPermission(groupDto);
    return await newGroup.save();
}

exports.update = async (groupCode, groupDto) => {
    const updatingGroup = new groupPermission(groupDto);
    const groupObject = omit(updatingGroup.toObject(), '_id');
    const filter = { code: groupCode };
    const options = { override: true, upsert: true };
    return await groupPermission.updateOne(filter, groupObject, options);
}

exports.remove = async (groupCode) => await groupPermission.deleteOne({ code: groupCode });


