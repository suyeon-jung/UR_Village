var express = require('express');
var router = express.Router();
var request = require('request');
require('dotenv').config();

/* GET home page. */
let SIGUN_CODE;
let GYEONGI_API_KEY = process.env.GYEONGGI_APIKEY;
let ODSAY_API_KEY = process.env.ODSAY_APIKEY;
let user_sigun;
let user_gu;
let user_dong;
let userLocation;
let user_latitude;
let user_longitude;
// 등급을 위한 변수
let food_A = 2;
let food_B = 1;
let fast_food_A = 9;
let fast_food_B = 5;
let library_A = 1;
let institute_A = 60;
let institute_B = 20;
let park_A = 10;
let park_B = 5;
let cctv_A = 30;
let cctv_B = 10;
let light_A = 2;
let light_B = 1;
let culture_A = 25;
let culture_B = 10;
let shop_A = 5;
let shop_B = 2;
let gym_A = 20;
let gym_B = 10;
let trans_A = 2;
let trans_B = 1;



// 결과 중 사용자 근처인지 검사하기 위한 변수
let user_target;
let sigun = [{
        sigun_name: '가평군',
        sigun_code: 41820
    },
    {
        sigun_name: '경기도',
        sigun_code: 41000
    },
    {
        sigun_name: '고양시',
        sigun_code: 41280
    },
    {
        sigun_name: '과천시',
        sigun_code: 41290
    },
    {
        sigun_name: '광명시',
        sigun_code: 41210
    },
    {
        sigun_name: '광주시',
        sigun_code: 41610
    },
    {
        sigun_name: '구리시',
        sigun_code: 41310
    },
    {
        sigun_name: '군포시',
        sigun_code: 41410
    },
    {
        sigun_name: '김포시',
        sigun_code: 41570
    },
    {
        sigun_name: '남양주시',
        sigun_code: 41360
    },
    {
        sigun_name: '동두천시',
        sigun_code: 41250
    },
    {
        sigun_name: '부천시',
        sigun_code: 41190
    },
    {
        sigun_name: '성남시',
        sigun_code: 41130
    },
    {
        sigun_name: '수원시',
        sigun_code: 41110
    },
    {
        sigun_name: '시흥시',
        sigun_code: 41390
    },
    {
        sigun_name: '안산시',
        sigun_code: 41270
    },
    {
        sigun_name: '안성시',
        sigun_code: 41550
    },
    {
        sigun_name: '안양시',
        sigun_code: 41170
    },
    {
        sigun_name: '양주시',
        sigun_code: 41630
    },
    {
        sigun_name: '양평군',
        sigun_code: 41830
    },
    {
        sigun_name: '여주시',
        sigun_code: 41670
    },
    {
        sigun_name: '연천군',
        sigun_code: 41800
    },
    {
        sigun_name: '오산시',
        sigun_code: 41370
    },
    {
        sigun_name: '용인시',
        sigun_code: 41460
    },
    {
        sigun_name: '의왕시',
        sigun_code: 41430
    },
    {
        sigun_name: '의정부시',
        sigun_code: 41150
    },
    {
        sigun_name: '이천시',
        sigun_code: 41500
    },
    {
        sigun_name: '파주시',
        sigun_code: 41480
    },
    {
        sigun_name: '평택시',
        sigun_code: 41220
    },
    {
        sigun_name: '포천시',
        sigun_code: 41650
    },
    {
        sigun_name: '하남시',
        sigun_code: 41450
    },
    {
        sigun_name: '화성시',
        sigun_code: 41590
    },
]

// 등급 평가하는 함수
let evalGrade = function(A, B, count) {
    if (count >= A) {
        return 'A';
    } else if (count >= B) {
        return 'B';
    } else {
        return 'C';
    }
}

let gradetoScore = function(grade) {
    if (grade == 'A') {
        return 3;
    } else if (grade == 'B') {
        return 2;
    } else {
        return 1;
    }
}
let scoretoGrade = function(score) {
    if (score == 3) {
        return 'A';
    } else if (score == 2) {
        return 'B';
    } else {
        return 'C';
    }
}
let avgGrade = function(grade1, grade2) {
        score1 = gradetoScore(grade1);
        score2 = gradetoScore(grade2);
        return scoretoGrade(Math.round((score1 + score2) / 2));
    }
    // 결과 중 사용자 근처인지 검사하기 위한 함수
let userArea = function(target, targetKey, user) {

    if (target[targetKey] != null && target[targetKey].includes(user)) {
        return true;
    } else {
        return false;
    }
}

// 사용자가 index 페이지에서 주소를 입력하고 넘어오면 
router.post('/', function(req, res) {

    user_sigun = req.body.sigun;
    user_gu = req.body.gu;
    user_dong = req.body.dong;
    userLocation = `${user_sigun} ${user_gu} ${user_dong}`;
    if (user_gu == '') {
        user_target = user_dong;
    } else {
        user_target = user_gu;
    }
    console.log('user_sigun', user_sigun);
    console.log('user_gu', user_gu);
    console.log('user_dong', user_dong);

    let KAKAO_API_KEY = process.env.KAKAO_APIKEY;
    let kakaoOptions = {
            url: 'https://dapi.kakao.com/v2/local/search/address.json',
            method: 'GET',
            headers: {
                'Authorization': `KakaoAK ${KAKAO_API_KEY}`
            },
            qs: {
                query: userLocation
            },
            encoding: 'UTF-8',
        }
        // sigun code 받는 부분
    for (var key in sigun) {
        if (userLocation.includes(sigun[key].sigun_name)) {

            SIGUN_CODE = sigun[key].sigun_code;
        }
        console.log(sigun[key].sigun_name);
    }
    console.log('SIGUN_CODE', SIGUN_CODE);
    request(kakaoOptions, function(err, res, body) {
        if (!err && res.statusCode == 200) {
            var result = JSON.parse(body);
            console.log('result', result);
            user_latitude = result.documents[0].address.x;
            user_longitude = result.documents[0].address.y;
            console.log('위도, 경도', user_latitude, user_longitude);
        }
    })
    res.render('category', { userLocation: userLocation });
});


router.get('/food', function(req, res) {

    // 맛집 리스트 조회
    let food_url = 'https://openapi.gg.go.kr/PlaceThatDoATasteyFoodSt';
    let fastfood_url = 'https://openapi.gg.go.kr/Genrestrtfastfood'
    let qs = `?KEY=${GYEONGI_API_KEY}&SIGUN_CD=${SIGUN_CODE}&Type=json`;

    request({
        url: food_url + qs,
        method: 'GET'
    }, function(err, response, body) {
        if (!err && res.statusCode == 200) {
            let food_result = JSON.parse(body);
            let stores = [];
            for (let i = 0; i < food_result.PlaceThatDoATasteyFoodSt[1].row.length; i++) {
                // 상호명, 음식명, 전화번호, 도로명주소(REFINE_ROADNM_ADDR), 지번 주소(REFINE_LOTNO_ADDR)
                store = food_result.PlaceThatDoATasteyFoodSt[1].row[i];
                if (userArea(store, 'REFINE_LOTNO_ADDR', user_target)) {

                    stores.push(store);
                }
            }

            food_grade = evalGrade(food_A, food_B, stores.length);

            request({
                url: fastfood_url + qs,
                method: 'GET'
            }, function(err, response, body) {
                if (!err && res.statusCode == 200) {
                    let fast_food_result = JSON.parse(body);
                    let fast_food_stores = [];
                    for (let i = 0; i < fast_food_result.Genrestrtfastfood[1].row.length; i++) {
                        fast_food_store = fast_food_result.Genrestrtfastfood[1].row[i];
                        // 폐업인 지점 제외 
                        if (fast_food_store['BSN_STATE_NM'] != '폐업' && userArea(fast_food_store, 'REFINE_LOTNO_ADDR', user_target)) {
                            fast_food_stores.push(fast_food_store);
                        }
                    }
                    fast_food_grade = evalGrade(fast_food_A, fast_food_B, fast_food_stores.length);

                    grade = avgGrade(food_grade, fast_food_grade);
                    res.render('result', { category: 'food', stores: stores, fast_food_stores: fast_food_stores, userLocation: userLocation, grade: grade });
                }

            })

        }
    });
});
router.get('/school', function(req, res) {

    let library_url = 'https://openapi.gg.go.kr/Tbggibllbrm';
    let institute_url = 'https://openapi.gg.go.kr/TninsttInstutM';
    let qs = `?KEY=${GYEONGI_API_KEY}&SIGUN_CD=${SIGUN_CODE}&Type=json`;

    request({
        url: library_url + qs,
        method: 'GET'
    }, function(err, response, body) {
        if (!err && res.statusCode == 200) {
            let library_result = JSON.parse(body);
            let librarys = [];
            for (let i = 0; i < library_result.Tbggibllbrm[1].row.length; i++) {
                library = library_result.Tbggibllbrm[1].row[i];
                if (userArea(library, 'REFINE_LOTNO_ADDR', user_target)) {
                    librarys.push(library);
                }

            }
            library_grade = evalGrade(library_A, 0.5, librarys.length);
            request({
                url: institute_url + qs,
                method: 'GET'
            }, function(err, response, body) {
                if (!err && res.statusCode == 200) {
                    let institute_result = JSON.parse(body);
                    let institutes = [];
                    for (let i = 0; i < institute_result.TninsttInstutM[1].row.length; i++) {
                        institute = institute_result.TninsttInstutM[1].row[i];
                        if (userArea(institute, 'REFINE_LOTNO_ADDR', user_target)) {
                            institutes.push(institute);
                        }
                    }
                    institute_grade = evalGrade(institute_A, institute_B, institutes);
                    grade = avgGrade(library_grade, institute_grade);
                    res.render('result', { category: 'school', librarys: librarys, institutes: institutes, userLocation: userLocation, grade: grade });
                }
            })
        }
    })
});
router.get('/park', function(req, res) {
    // let cityparknum = 0;
    let citypark_url = 'https://openapi.gg.go.kr/CityPark';

    let qs = `?Type=json&KEY=${GYEONGI_API_KEY}&SIGUN_CD=${SIGUN_CODE}`;
    request({
        url: citypark_url + qs,
        method: 'GET'
    }, function(err, response, body) {
        if (!err && res.statusCode == 200) {
            let city_park_result = JSON.parse(body);
            let city_parks = [];
            for (let i = 0; i < city_park_result.CityPark[1].row.length; i++) {
                city_park = city_park_result.CityPark[1].row[i];
                if (userArea(city_park, 'REFINE_LOTNO_ADDR', user_target)) {
                    city_parks.push(city_park);
                }
            }
            grade = evalGrade(park_A, park_B, city_parks.length);
            res.render('result', { category: 'park', city_parks: city_parks, userLocation: userLocation, grade: grade });
        }
    })
});

router.get('/transport', function(req, res) {


    let bus_url = 'https://api.odsay.com/v1/api/pointSearch?';
    let subway_url = 'https://api.odsay.com/v1/api/pointSearch?';
    let qs = `?lang=0&x=${user_latitude}&y=${user_longitude}&radius=2000&stationClass=2&apiKey=${ODSAY_API_KEY}`;


    request({
        url: bus_url + qs,
        method: 'GET'
    }, function(err, response, body) {

        if (!err && res.statusCode == 200) {
            let bus_result = JSON.parse(body);
            console.log('bus_result', bus_result);
            let busStations = [];
            for (let i = 0; i < bus_result.result.station.length; i++) {
                station = bus_result.result.station[i];
                busStations.push(station);
            }
            bus_grade = evalGrade(trans_A, trans_B, busStations.length);
            request({
                url: subway_url + qs,
                method: 'GET'
            }, function(err, response, body) {
                if (!err && res.statusCode == 200) {
                    let subway_result = JSON.parse(body);
                    let subwayStations = [];
                    for (let i = 0; i < subway_result.result.station.length; i++) {
                        station = subway_result.result.station[i];
                        subwayStations.push(station);
                    }
                    sub_grade = evalGrade(trans_A, trans_B, subwayStations.length);
                    grade = avgGrade(bus_grade, sub_grade);
                    console.log(busStations);
                    console.log('subwayStaions', subwayStations);
                    res.render('result', { category: 'transport', busStations: busStations, subwayStations: subwayStations, userLocation: userLocation, grade: grade })
                }
            })

        }
    })

});
router.get('/safe', function(req, res) {

    let cctv_url = 'https://openapi.gg.go.kr/CCTV';
    let light_url = 'https://openapi.gg.go.kr/SECRTLGT'
    let qs = `?Type=json&KEY=${GYEONGI_API_KEY}&SIGUN_CD=${SIGUN_CODE}`;
    request({
        url: cctv_url + qs,
        method: 'GET'
    }, function(err, response, body) {
        if (!err && res.statusCode == 200) {
            let cctv_result = JSON.parse(body);
            let cctvs = [];
            for (let i = 0; i < cctv_result.CCTV[1].row.length; i++) {
                cctv = cctv_result.CCTV[1].row[i];
                if (userArea(cctv, 'REFINE_LOTNO_ADDR', user_target)) {
                    cctvs.push(cctv);
                }
            }
            cctv_grade = evalGrade(cctv_A, cctv_B, cctvs.length);
            request({
                url: light_url + qs,
                method: 'GET'
            }, function(err, response, body) {
                if (!err && res.statusCode == 200) {
                    let light_result = JSON.parse(body);
                    let lights = [];
                    for (let i = 0; i < light_result.SECRTLGT[1].row.length; i++) {
                        light = light_result.SECRTLGT[1].row[i];
                        if (userArea(light, 'REFINE_LOTNO_ADDR', user_target)) {
                            lights.push(light);
                        }
                    }
                    light_grade = evalGrade(light_A, light_B, lights.length);
                    grade = avgGrade(cctv_grade, light_grade);
                    res.render('result', { category: 'safe', cctvs: cctvs, lights: lights, userLocation: userLocation, grade: grade });
                }
            })
        }

    })
});

router.get('/culture', function(req, res) {
    // 영화관
    let movie_url = 'https://openapi.gg.go.kr/MovieTheater';
    let qs = `?Type=json&KEY=${GYEONGI_API_KEY}&SIGUN_CD=${SIGUN_CODE}`;
    request({
        url: movie_url + qs,
        method: 'GET'
    }, function(err, response, body) {
        if (!err && res.statusCode == 200) {
            let movie_result = JSON.parse(body);
            let movies = [];
            for (let i = 0; i < movie_result.MovieTheater[1].row.length; i++) {
                movie = movie_result.MovieTheater[1].row[i];
                // 폐업인 지점 제외 
                if (!movie['BSN_STATE_NM'].includes('폐업') && userArea(movie, 'REFINE_LOTNO_ADDR', user_target)) {
                    movies.push(movie);
                }

            }
            grade = evalGrade(culture_A, culture_B, movies.length);
            res.render('result', { category: 'culture', movies: movies, userLocation: userLocation, grade: grade });
        }
    });
});

router.get('/shop', function(req, res) {

    let mallnum = 0;
    let shop_url = 'https://openapi.gg.go.kr/MrktStoreM';
    let qs = `?Type=json&KEY=${GYEONGI_API_KEY}&SIGUN_CD=${SIGUN_CODE}`;
    request({
        url: shop_url + qs,
        method: 'GET'
    }, function(err, response, body) {
        if (!err && res.statusCode == 200) {
            let shop_result = JSON.parse(body);
            let shops = [];
            for (let i = 0; i < shop_result.MrktStoreM[1].row.length; i++) {
                shop = shop_result.MrktStoreM[1].row[i];
                // 폐업인 지점 제외 
                if (userArea(shop, 'REFINE_LOTNO_ADDR', user_target)) {
                    shops.push(shop);
                }
            }
            grade = evalGrade(shop_A, shop_B, shops.length)
            res.render('result', { category: 'shop', shops: shops, userLocation: userLocation, grade: grade });
        }

    })
});

router.get('/gym', function(req, res) {
    let gym_url = 'https://openapi.gg.go.kr/PhysicaFitnessTrainingPlace';
    let qs = `?Type=json&KEY=${GYEONGI_API_KEY}&SIGUN_CD=${SIGUN_CODE}`;
    request({
        url: gym_url + qs,
        method: 'GET'
    }, function(err, response, body) {
        if (!err && res.statusCode == 200) {
            let gym_result = JSON.parse(body);
            let gyms = [];
            for (let i = 0; i < gym_result.PhysicaFitnessTrainingPlace[1].row.length; i++) {
                gym = gym_result.PhysicaFitnessTrainingPlace[1].row[i];
                if (userArea(gym, 'REFINE_LOTNO_ADDR', user_target)) {
                    gyms.push(gym);
                }
            }
            grade = evalGrade(gym_A, gym_B, gyms.length)
            res.render('result', { category: 'gym', gyms: gyms, userLocation: userLocation, grade: grade });
        }
    })
});


module.exports = router;