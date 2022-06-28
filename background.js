

function fetchPostAndAds(words, callback) {
    console.log(words)
    var url = "https://test2.dad.one/api/view?q=" + words;

    fetch(url).then(r => r.json()).then(result => {
        if (result.data) {
            res = '<div id="dadContainer" style="width:319px;box-sizing: border-box;background: #FFFFFF;border: 1px solid #DEDEDE;box-shadow: 0px 3px 10px rgba(12, 46, 78, 0.3);border-radius: 6px;">' +
                '<div id="dadTop" class="dad-sp">' +
                '   <div class="title" style="margin-top:10px;margin-left:10px;font-family: \'Poppins\';font-style: normal;font-weight: 600;font-size: 18px;line-height: 27px;color: #000000;">' + words + '</div>' +
                '   <div class="line" style="width: 317px;height: 0px;margin-top: 10px;border: 1px solid #DEDEDE;"></div>' +
                '</div>' +
                '<div id="dadMiddle">';

            ad = result.data.ads[0]
            if (ad.url != null) {
                res += '    <div id="dadBottom" style="margin-top: 30px; position: relative;">' +
                    '        <div class="line" style="width: 317px;height: 0px;margin-top: 10px;border: 1px solid #DEDEDE;"></div>' +
                    '        <div style="position: absolute;width: 64px;height: 20px;margin-top:10px;margin-left:250px;background: rgba(0, 0, 0, 0.4);border-radius: 4px; float: right;">' +
                    // '            <div style="width: 54px;height: 15px;margin-left: 13px;font-family: \'Poppins\';font-style: normal;font-weight: 400;font-size: 10px;line-height: 20px;color: #FFFFFF;">Sponsered</div>' +
                    '            <div style="width: 54px;height: 15px;font-family: \'Poppins\';font-style: normal;font-weight: 400;font-size: 10px;line-height: 20px;color: #FFFFFF;">sponsored</div>' +
                    '        </div>' +
                    '        <div style="margin-left:10px;margin-top: 10px;">' +
                    '            <a href="' + ad.url + '" target="_blank">' +
                    '                <img style="width:300px;height:150px;" id="adBanner" key="' + ad.id + '" src="' + ad.image + '" title="' + ad.title + '" />' +
                    '            </a>' +
                    '        </div>' +
                    // '        <div style="width: 82px;height: 15px;margin-left:225px;font-family: \'Poppins\';font-style: normal;font-weight: 400;font-size: 10px;line-height: 15px;text-align: right;color: #9A9A9A;">Powered by DAD</div>' +
                    '        <div style="height: 15px;padding-right:5px;font-family: \'Poppins\';font-style: normal;font-weight: 400;font-size: 10px;line-height: 15px;text-align: right;color: #9A9A9A;">Powered by DAD</div>' +
                    '    </div>';
            }
            res += ' </div>' +
                ' </div>';

            callback(res)
        } else {

        }
    })
}
