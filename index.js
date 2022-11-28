
const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const csv = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'data.csv',
    header: [
        { id: 'u', title: 'uid' },
        { id: 'iv', title: 'iv' },
        { id: 'ed', title: 'ed' }
    ]
});

//Encrypting text
function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// Decrypting text
function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
 async function store(nam, pass) {
    let enp = encrypt(pass)
    // console.log(enp)
    let sdata = [{ u: nam, iv: enp.iv, ed: enp.encryptedData },]
    await csvWriter.writeRecords(sdata)

}
 function sigin(uid, p) {
    var flag=0

    fs.createReadStream('data.csv')
        .pipe(csv({ delimiter: ':' }))
        .on('data', function (csvrow) {
           
            if (csvrow.uid == uid) {
                console.log('!!!!welcome '+ csvrow.uid)
                flag=1
                var pass = decrypt({ iv: csvrow.iv, encryptedData: csvrow.ed })
                if (pass == p) {
                    console.log('Successfull signin')
                } else {
                    console.log('invalid password,try again')
                }
            }
       

        })
        .on('end',function(){
            if(!flag){
                console.log('no user found '+uid)
            }
        
        })
}
 store('ald', '1,2,3')
 store('aldi', '1,2,3')
