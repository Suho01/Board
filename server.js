const express = require('express'); // require : 무언가를 불러와서 변수에 저장하겠다
const app = express();
const port = 5000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')); // 기본 링크

// mongodb+srv://admin:qwe1234@cluster0.4uiul7i.mongodb.net/
const {MongoClient, ObjectId} = require('mongodb');
let db;
let sample; // sample 데이터
const url = 'mongodb+srv://admin:qwe1234@cluster0.4uiul7i.mongodb.net/';
new MongoClient(url).connect().then((client) => {
    db = client.db("board");
    sample = client.db("sample_training");
    console.log("DB 연결 완료");

    app.listen(port, () => {
        console.log(`${port}번 포트 서버 실행`);
    });

}).catch((error) => {
    console.log(error);
});


app.get('/', (req, res) => { // req : request, res : response
    // res.send("Hello Suho..❤");
    res.sendFile(__dirname + '/page/index.html'); // sendFile : 어떤 파일을 내보낸다.
});
app.get('/about', (req, res) => {
    // res.send("about page..❤");
    res.sendFile(__dirname + '/page/about.html');
    // db.collection("notice").insertOne({
    //     title : "첫번째 글",
    //     content : "두번째 글"
    // });
});

app.get('/list', async (req, res) => {
    const result = await db.collection("notice").find().toArray();
    console.log(result[0]);

    res.render("list.ejs", {
        data : result
    });
});

app.get('/suho', (req, res) => {
    res.send("Suho cho page..❤");
});

app.get('/view/:id', async (req, res) => {
    const result = await db.collection("notice").findOne({
        _id : new ObjectId(req.params.id)
    });
    // console.log(result);
    // res.send(result);
    res.render("view.ejs", {
        data : result
    });
});

app.get('/portfolio', (req, res) => {
    res.send("포폴 페이지2");
});

// 1. Uniform Interface : 여러 Url과 method는 일관성이 있어야하며, 하나의 Url에서는 하나의 데이터만 가져오게 디자인하며, 간결하고 예측 가능한 Url과 method를 만들어야한다.
// 동사보다는 명사 위주, 띄어쓰기는 언더바 대신 대시, 파일 확장자는 사용 금지, 하위 문서를 뜻할 땐 / 기호를 사용

// 2. 클라이언트와 서버역할 구분 : 유저에게 서버 역할을 맡기거나 직접 입출력을 시켜선 안된다.

// 3. stateless : 요청들은 서로 의존성이 있으면 안되고, 각각 독립적으로 처리되어야 한다.
// 4. Cacheable : 서버가 보내는 자료는 캐싱이 가능해야 한다, 대부분 컴퓨터가 동작함
// 5. Layered System : 서버 기능을 만들 때 레이어를 걸쳐서 코드가 실행되어야 한다. * 몰라도 됨
// 6. Code on Demeand : 서버는 실행 가능한 코드를 보낼 수 있다. * 몰라도 됨