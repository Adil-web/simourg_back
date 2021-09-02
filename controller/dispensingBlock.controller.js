const { hex2dec, base64 } = require('../decoders')
const sha3_512 = require('js-sha3').sha3_512
const axios = require('axios')
const jwt = require('jsonwebtoken')
const parser = require('fast-xml-parser')
// const path = require('path')
// const sharp = require('sharp')
// const fs = require('fs');

let imgBase64 = []

class DispensingBlockController {
    // async getImg(req, res) {
    //     const { img } = req.files
    //     console.log(img)
    //     const fileName = Date.now().toString() + '.jpg'
    //     await img.mv(path.resolve(__dirname, fileName))
    //     try {
    //         if(img.length > 1) {
    //             img.forEach(el => {
    //                 imgBase64.push(Buffer.from(el.data).toString('base64'))
    //             })
    //             res.json('imgBase64 success...')
    //         }
    //         imgBase64.push(Buffer.from(img.data).toString('base64'))
    //         res.json('imgBase64 success...')
    //     } catch (e) {
    //         console.log(e)
    //     }
    //     console.log(imgBase64)
    //     setTimeout(() => {
    //         sharp(path.resolve(__dirname, fileName))
    //         .resize(720)
    //         .jpeg({ mozjpeg: true })
    //         .toFile(fileName, (err, info) => {
    //             if(err) {
    //                 console.log(err)
    //                 return
    //             }
    //             fs.unlink(path.resolve(__dirname, fileName), (error) => {
    //                 if (error) {
    //                     throw error;
    //                 }
    //                 fs.readFile(path.resolve(__dirname, '..', fileName), (er, data) => {
    //                     if (er) throw er
    //                     imgBase64 = Buffer.from(data).toString('base64')
    //                     fs.unlink(path.resolve(__dirname, '..', fileName), (e) => {
    //                         if (e) {
    //                             res.json({error: e})
    //                             throw e;
    //                         }
    //                     });
    //                     res.json(info)
    //                 })
    //             });
    //         });
    //     }, 200)
    // }

    async createDispensing(req, res) {
        const { o_chemical, litersNumber, o_organization, o_bar_code, o_recipient, o_date_of_issue, o_time_of_issue, token } = req.body
        const { username, password } = jwt.decode(token)
        const iid = hex2dec("C057003")
        const pass = sha3_512(password)
        const auth = base64("<authdata msg_id=\"1\" user=\"" + username + "\" password=\"" + pass + "\" msg_type=\"5000\" user_ip=\"127.0.0.1\" />")
        let xmlCreateObject =
            `<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<sbapi>
<header>
<interface id=\"${iid}\" version=\"8\" />
<message ignore_id=\"yes\" id=\"1\" type=\"5000\" created=\"2021-05-05T07:14:16z\"/>
<error id=\"0\" />
<auth pwd=\"hash\">${auth}</auth>
</header>
<body>
<function name=\"f_api_tar_create_object\">
<arg name=\"recipient\">${o_recipient}</arg>
<arg name=\"organization\">${o_organization}</arg>
<arg name=\"drug_name\">${o_chemical}</arg>
<arg name=\"container\">${litersNumber}</arg>
<arg name=\"bar_code\">${o_bar_code}</arg>
<arg name=\"date_of_issue\">${o_date_of_issue}</arg>
<arg name=\"time_of_issue\">${o_time_of_issue}</arg>
<arg name=\"photo\">${imgBase64.length > 1 ? imgBase64 : imgBase64[0]}</arg>
</function>
</body>
</sbapi>`

        const config = {
            headers: { 'Content-Type': 'text/xml' }
        }

        let dataXml

        await axios.post('https://bpm.atameken-agro.com/api/', xmlCreateObject, config).then((response) => {
            dataXml = parser.parse(response.data)
            dataXml = dataXml.sbapi.body.response
        }).catch((err) => console.log(err))
        let getXmlObject =
            `<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<sbapi>
<header>
<interface id=\"${iid}\" version=\"8\" />
<message ignore_id=\"yes\" id=\"1\" type=\"5000\" created=\"2021-05-05T07:14:16z\"/>
<error id=\"0\" />
<auth pwd=\"hash\">${auth}</auth>
</header>
<body>
<function name=\"f_api_tar_get_object\">
<arg name=\"object\">${dataXml}</arg>
</function>
</body>
</sbapi>`

        const options = {
            attributeNamePrefix: "",
            ignoreAttributes: false,
        }
        await axios.post('https://bpm.atameken-agro.com/api/', getXmlObject, config).then((response) => {
            let getXml = parser.parse(response.data, options)
            let get = { objects: [] }
            get.objects.push(
                {
                    number: getXml.sbapi.body.response.number,
                    created: getXml.sbapi.body.response.created,
                    creator: getXml.sbapi.body.response.creator,
                    group: getXml.sbapi.body.response.group,
                }
            )
            res.json('Успешно...')
        }).catch((err) => console.log(err))
    }
}

module.exports = new DispensingBlockController()
