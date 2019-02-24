const onedrive = require('onedrive-api')
const fs = require('fs')

const token = `eyJ0eXAiOiJKV1QiLCJub25jZSI6IkFRQUJBQUFBQUFDRWZleFh4amFtUWIzT2VHUTRHdWd2OVVPa0lLYTBXcHpvd250UmR1aXJ3d0x4Y0lKVVQ0OFRkVEFzWTZPV3lxWFY0dmQzUmt5azlKdk5xUHZBRmQ0RzNlUGlvX1ZYamlycUU3Rkx5NzR5c3lBQSIsImFsZyI6IlJTMjU2IiwieDV0IjoiLXN4TUpNTENJRFdNVFB2WnlKNnR4LUNEeHcwIiwia2lkIjoiLXN4TUpNTENJRFdNVFB2WnlKNnR4LUNEeHcwIn0.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82YmMyNzE5Yy1kZTVlLTRkOWUtYWVhMC00NzM1NTNmYzk1MmUvIiwiaWF0IjoxNTUxMDMzODc4LCJuYmYiOjE1NTEwMzM4NzgsImV4cCI6MTU1MTAzNzc3OCwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IjQySmdZSWcrM1BZbVlmMFBQajM1dmJraEh2OFZJNTdWKy9xc1NXQThXeGE5ZFpmZmZIRUEiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6InBkZi12aWV3ZXIiLCJhcHBpZCI6IjdhMjY0MTFkLTg5NDUtNDk3ZC05YmRmLTE5MTg1OGM2NGJmMCIsImFwcGlkYWNyIjoiMSIsImZhbWlseV9uYW1lIjoiUGFkcsOzbiIsImdpdmVuX25hbWUiOiJIYXJyeSIsImlwYWRkciI6IjE5MC4yMDYuMTA4LjI0IiwibmFtZSI6IkhhcnJ5IFBhZHLDs24iLCJvaWQiOiI4YjNiM2NhMS1hNTIzLTQxMTItODlmZC1jZjg2OTc5NDYyYTUiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMTQ1NDQ3MTE2NS03OTA1MjU0NzgtNzI1MzQ1NTQzLTEyNjU3MjkiLCJwbGF0ZiI6IjE0IiwicHVpZCI6IjEwMDMzRkZGQUREMDQ4MDAiLCJzY3AiOiJBZ3JlZW1lbnQuUmVhZC5BbGwgRmlsZXMuUmVhZFdyaXRlLkFsbCBGaWxlcy5SZWFkV3JpdGUuQXBwRm9sZGVyIFVzZXIuUmVhZCBVc2VyLlJlYWQuQWxsIFVzZXIuUmVhZEJhc2ljLkFsbCBVc2VyLlJlYWRXcml0ZSBVc2VyLlJlYWRXcml0ZS5BbGwgcHJvZmlsZSBvcGVuaWQgZW1haWwiLCJzdWIiOiJCVWVwQXk3eWRybGJXRFY5dzloWWF1VkZYaWFVVGhjZ1o3bXFWX1JzcnhJIiwidGlkIjoiNmJjMjcxOWMtZGU1ZS00ZDllLWFlYTAtNDczNTUzZmM5NTJlIiwidW5pcXVlX25hbWUiOiJoUGFkcm9uQG5hdmllcmFzYnIuY29tIiwidXBuIjoiaFBhZHJvbkBuYXZpZXJhc2JyLmNvbSIsInV0aSI6IjZuRkdPSUJBVDBLQ08xV1JUYVNEQUEiLCJ2ZXIiOiIxLjAiLCJ4bXNfc3QiOnsic3ViIjoiWUhLdU1JbFl3LUItRXB2NG85TWVzX1FYSjg0QUxoQURsREFZVGFjNGMzSSJ9LCJ4bXNfdGNkdCI6MTUzNDE3MTM4Nn0.XOiLt1njnc_7Z58DYxD4rLnJ0CZKeDXOcnMF3aovsb1FQhWKTWhsUPRPLd-XGirPvv4ys1ELMYGQslwZATrBaHdRUlo1lYKNabLTGZgJ9H_wLvYqYbkJCOWLPSVyicFZ3lBwRGbZ46yEl6KGdIEIDhnU2PIez-TdDQJvCbKwudnJ_zfWyBkGFdXwpAg1NW8YRbeSUsDZkt6xKFhjA_I0gayM6oN2798UbyDuP8GBNWturjZIzkTbWuhgt9PxLWiP2CK39K4yGr27faoj1D0-WeSk1zuAw9S3U3OdjMrfXAHA8h_WL5wZl_ASXpn1UDC4LvKMFxy8qWFf5XYFui3gYw`
const idFolderRoot = '017R6ELVIN6OMMV3ONY5CJXPIIKSYJRT4R'

async function getFolders(id, name){
    let response = null

    try {
        let childrens = await onedrive.items.listChildren({
            accessToken: token,
            itemId: id
        })

        //console.log(childrens)

        for (let item of childrens.value){
            if(item.name == name){
                response = item.id
            }
        }

        return response

    } catch (error) {
        console.log(error)
    }

}

async function getFiles(id){

    let response = []

    try {
        let childrens = await onedrive.items.listChildren({
            accessToken: token,
            itemId: id
        })

        for (let item of childrens.value){
            response.push(item.name.split('.pdf')[0])
        }

        return response

    } catch (error) {
        console.log(error)
    }

}


async function main(){
    let year = await getFolders(idFolderRoot, '2015')
    console.log('Paso 1')
    let company = await getFolders(year, 'Empresa 1')
    console.log('Paso 2')
    let month = await getFolders(company, 'Enero')
    console.log('Paso 3')
    let type = await getFolders(month, 'Factura')
    console.log('Paso 4')
    let files = await getFiles(type)
    console.log(files)
}

main()

//export default _onedrive