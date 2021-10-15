// LCC DFS 좌표변환을 위한 기초 자료
    //
    const RE = 6371.00877; // 지구 반경(km)
    const GRID = 5.0; // 격자 간격(km)
    const SLAT1 = 30.0; // 투영 위도1(degree)
    const SLAT2 = 60.0; // 투영 위도2(degree)
    const OLON = 126.0; // 기준점 경도(degree)
    const OLAT = 38.0; // 기준점 위도(degree)
    const XO = 43; // 기준점 X좌표(GRID)
    const YO = 136; // 기1준점 Y좌표(GRID)
    //
    // LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, x:위도, y:경도), "toLL"(좌표->위경도,x:x, y:y) )
    //
function changeCode(code, x, y) {
    const DEGRAD = Math.PI / 180.0;
    const RADDEG = 180.0 / Math.PI;
 
    let re = RE / GRID;
    const slat1 = SLAT1 * DEGRAD;
    const slat2 = SLAT2 * DEGRAD;
    const olon = OLON * DEGRAD;
    const olat = OLAT * DEGRAD;
 
    let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);
    const roArray = {};
    if (code == "toXY") {
 
        roArray['lat'] = x;
        roArray['lng'] = y;
        let ra = Math.tan(Math.PI * 0.25 + (x) * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        let theta = y * DEGRAD - olon;
        if (theta > Math.PI) theta -= 2.0 * Math.PI;
        if (theta < -Math.PI) theta += 2.0 * Math.PI;
        theta *= sn;
        roArray['nx'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
        roArray['ny'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    }
    else {
        roArray['nx'] = x;
        roArray['ny'] = y;
        const xn = x - XO;
        const yn = ro - y + YO;
        ra = Math.sqrt(xn * xn + yn * yn);
        if (sn < 0.0) - ra;
        const alat = Math.pow((re * sf / ra), (1.0 / sn));
        alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;
 
        if (Math.abs(xn) <= 0.0) {
            theta = 0.0;
        }
        else {
            if (Math.abs(yn) <= 0.0) {
                theta = Math.PI * 0.5;
                if (xn < 0.0) - theta;
            }
            else theta = Math.atan2(xn, yn);
        }
        const alon = theta / sn + olon;
        roArray['lat'] = alat * RADDEG;
        roArray['lng'] = alon * RADDEG;
    }
    return roArray;
}
// changeCode