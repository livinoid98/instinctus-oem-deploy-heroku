const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 8001;//process.env.PORT;

app.use('/', express.static(path.join(__dirname, 'views')));
app.use('/css', express.static(__dirname + '/css'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');

try{
    fs.readdirSync('uploads');
}catch(error){
    console.error('upload 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}
const upload = multer({
    storage: multer.diskStorage({
        destination(req,file,done){
            done(null, 'uploads/');
        },
        filename(req,res,done){
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext)+Date.now()+ext);
        },
    }),
    limits: {filesize: 5 *1024*1024},
});


app.get('/', (req,res) => {
    res.render('index.ejs');
});

app.get('/brandstory', (req,res) => {
    res.send('brandstory.html');
});

app.get('/product', (req,res)=>{
    res.send('product.html');
});

app.get('/contactus', (req,res)=>{
    res.send('contact_us.html');
});

app.post('/contact', function(req,res,next){
    let contact_info = req.body.name + '№' + req.body.email + '№' + req.body.title + '№' + req.body.content + '㏇';
    
    fs.appendFile('./formList.txt', contact_info, (err) => {
        if(err){
            console.log(err);
        }else{
            console.log('write file success');
        }
    });
    res.redirect('/list');
});

app.get('/list', function(req,res,next){
    fs.readFile('./formList.txt', 'utf8', (err,data) => {
        if(err){
            console.log(err);
        }else{
            let arrayTxt = data.split('㏇');
            let arrayName = [];
            let arrayEmail = [];
            let arrayTitle = [];
            let arrayDescription = [];
            for(let i=0; i<arrayTxt.length; i++){
                let column = arrayTxt[i].split('№');
                arrayName.push(column[0]);
                arrayEmail.push(column[1]);
                arrayTitle.push(column[2]);
                arrayDescription.push(column[3]);
            }
            console.log(arrayName, arrayEmail, arrayTitle, arrayDescription);
            return res.render('list.ejs', {name: arrayName, email:arrayEmail, title:arrayTitle, content: arrayDescription});
        }
    });
});

app.get('/list_delete', function(req,res,next){
    let empty_data = '';
    fs.writeFile('./formList.txt', empty_data, (err, data) => {
        if(err){
            console.log(err);
        }else{
            res.redirect('/list');
        }
    });
});

app.get('upload', (req,res) => {
    res.sendFile(path.join(__dirname, 'contact_us.ejs'));
});
app.post('/upload',
    upload.fields([{name:'image'}]),
    (req,res)=>{
        console.log(req.files, req.body);
        res.send('ok');
    }
);

app.listen(port, ()=>{
    console.log(`app listening at http://localhost:${port}`);
});