const path = require('path');
const excelToJson = require('convert-excel-to-json');
const MongoDB = require("../../models/mongo");
const db = new MongoDB();

async function getComponents(req, res, next) {
    try {
        let result = await db.getData('components');
        res.status(200).json(result)
    }
    catch(e) {
        res.status(400).json('Unsuccessful loading of component\'s list please try again later ')
    }
}

async function uploadComponents(req, res, next) {
    try {
        let filePath = path.normalize(
            path.join(__dirname, `../../public/${req.file.filename}`)
        )

        const result = excelToJson({
            sourceFile: filePath,
            columnToKey: {
                A: 'manufacturer',
                B: 'sapNum',
                C: 'manNum',
                D: 'description',
                E: 'price',
                F: 'qty',
                G: 'type',
                H: 'compatibleSrv'
            },
            header: {
                rows: 1
            }
        });

        // console.log(result.Sheet1)
        try {
            let updateResult = await db.insertDbFile('components', result.Sheet1)

            // fs.readFile(req.files.file.path, function(err, data){
            //     console.log(data)
            //     // Do something with the data (which holds the file information)
            //   });

            res.status(200).json(updateResult)
        } catch(e) {
            res.status(404).json('Unsuccessful import please try again later')
        }

    }
    catch(e) {
        res.status(500).json('Don\'t forget to attach a file!')
    }
}

async function updateSingleComponent(req, res, next) {
    try {
        const { _id: id, ...data } = req.body
        let result = await db.updateComponentData(id, data)
        res.status(200).json(result.modifiedCount)
    }
    catch(e) {
        res.status(404).json('Something went wrong please try again later')
    }
}

async function updateTypes(req, res, next) {
    try {
        const { type } = req.body
        let result = await db.updateTypes(type)
        console.log(result.ops[0])
        let response = {insertedCount: 1, type: type}
        res.status(200).json(response)
    }
    catch(e) {
        res.status(404).json(e.message)
    }
}

async function deleteType(req, res, next) {
    try {
        const { id } = req.body
        let result = await db.deleteType(id)
        console.log(result)
        res.status(200).json(result)
    }
    catch(e) {
        res.status(404).json(e.message)
    }
}

async function updateModels(req, res, next) {
    try {
        const { manufacturer, model } = req.body
        let result = await db.updateModels(manufacturer, model)
        console.log(result)
        let response = {insertedCount: 1, type: model}
        res.status(200).json(response)
    }
    catch(e) {
        res.status(404).json(e.message)
    }
}

async function deleteModel(req, res, next) {
    try {
        const { manufacturer, name } = req.body
        let result = await db.deleteModel(manufacturer, name)
        console.log(result)
        res.status(200).json(result)
    }
    catch(e) {
        res.status(404).json(e.message)
    }
}

module.exports = {
    getComponents,
    uploadComponents,
    updateSingleComponent,
    updateTypes,
    deleteType,
    updateModels,
    deleteModel,
}