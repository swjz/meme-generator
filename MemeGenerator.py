# coding=utf-8
from __future__ import print_function

import json
import os
import chooseTheSentence

from flask import Flask, request, send_from_directory
import requests
from PIL import ImageFont
from PIL import Image
from PIL import ImageDraw

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'


@app.route('/')
def hello():
    return "hello!"


@app.route('/upload', methods=['POST'])
def upload():
    upload_file = request.files['file']
    if upload_file:
        filename = 'base.jpg'
        upload_file.save(os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], filename))

        # data to be sent to api
        data = {'api_id': 'f9bf8274b9174a5a852ed309bd960fda',
                'api_secret': '37adb7200e724998823919098a8601cb',
                'attributes': '1'}
        files = {'file': open(os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], 'base.jpg'), 'rb')}

        # sending post request and saving response as response object
        response = requests.post(url='https://v1-api.visioncloudapi.com/face/detection', data=data, files=files)

        # extracting response text
        responseJSON = json.loads(response.text)
        emotions = responseJSON['faces'][0]['emotions']  # type is dict
        emotions = responseJSON['faces'][0]['emotions']  # type is dict
        attractive = responseJSON['faces'][0]['attributes']['attractive']
        eye_open = responseJSON['faces'][0]['attributes']['eye_open']
        gender = responseJSON['faces'][0]['attributes']['gender']
        age = responseJSON['faces'][0]['attributes']['age']
        sunglass = responseJSON['faces'][0]['attributes']['sunglass']
        smile = responseJSON['faces'][0]['attributes']['smile']
        mouth_open = responseJSON['faces'][0]['attributes']['mouth_open']

        mostLikelyEmotion = max(emotions, key=emotions.get)
        sentenceInstance = chooseTheSentence.ChooseTheSentence()
        sentenceInstance.chooseTheSentence(mostLikelyEmotion, gender=gender, age=age, attractive=attractive,
                                           eye_open=eye_open, mouth_open=mouth_open, sunglass=sunglass, smile=smile)

        # 打开底版图片
        imageFile = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], 'base.jpg')
        image = Image.open(imageFile)

        # 在图片上添加文字
        xSize, ySize = image.size

        text = sentenceInstance.getTheSentence()
        print(type(text))
        # textUnicode = unicode(text, "utf-8")
        # textUnicode = text
        textLength = len(text)
        fontSize = (int)(min(xSize, ySize) / 4 / textLength ** 0.5)
        font = ImageFont.truetype(font='/root/Arial Unicode.ttf', size=fontSize)

        offset = fontSize * textLength / 2  # 文本框两端在x轴从中间向左右分别的偏移量

        leftRed, leftGreen, leftBlue = image.getpixel((xSize / 2 - offset, 0.8 * ySize))
        middleRed, middleGreen, middleBlue = image.getpixel((xSize / 2, 0.8 * ySize))
        rightRed, rightGreen, rightBlue = image.getpixel((xSize / 2 + offset, 0.8 * ySize))

        # textColor = (
        #     255 - (leftRed + middleRed + rightRed) / 5, 255 - (leftGreen + middleGreen + rightGreen) / 5,
        #     255 - (leftBlue + middleBlue + rightBlue) / 5)
        textColor = 'white'

        draw = ImageDraw.Draw(image)

        bp = 1
        shadowcolor = 'black'
        (x, y) = (xSize / 2 - offset, 0.8 * ySize)
        draw.text((x - bp, y), text, font=font, fill=shadowcolor)
        draw.text((x + bp, y), text, font=font, fill=shadowcolor)
        draw.text((x, y - bp), text, font=font, fill=shadowcolor)
        draw.text((x, y + bp), text, font=font, fill=shadowcolor)


        # thicker border
        draw.text((x - bp, y - bp), text, font=font, fill=shadowcolor)
        draw.text((x + bp, y - bp), text, font=font, fill=shadowcolor)
        draw.text((x - bp, y + bp), text, font=font, fill=shadowcolor)
        draw.text((x + bp, y + bp), text, font=font, fill=shadowcolor)

        # now draw the text over it
        draw.text((x, y), text, font=font, fill=textColor)

        # draw.text([xSize / 2 - offset, 0.8 * ySize], textUnicode, textColor, font)
        draw = ImageDraw.Draw(image)

        # 保存
        image.save(os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], 'target.jpg'))

        return response.text
    else:
        return request.data


@app.route('/download', methods=['GET'])
def download():
    directory = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'])
    return send_from_directory(directory, 'target.jpg', as_attachment=True)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7959, debug=True)
