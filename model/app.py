from flask import Flask, request, jsonify
from flask_cors import CORS

# color classify package
import cv2
from .color.color_recognition_api import color_histogram_feature_extraction
from .color.color_recognition_api import knn_classifier
import os


app = Flask(__name__)
CORS(app)

PATH = './training.data'

if os.path.isfile(PATH) and os.access(PATH, os.R_OK):
    print ('training data is ready, classifier is loading...')
else:
    print ('training data is being created...')
    open('training.data', 'w')
    color_histogram_feature_extraction.training()
    print ('training data is ready, classifier is loading...')

# Color classification function
def classify_color(image_path):
    source_image = cv2.imread(image_path)
    color_histogram_feature_extraction.color_histogram_of_test_image(source_image)
    prediction = knn_classifier.main('training.data', 'test.data')
    # print('Detected color is:', prediction)
    return prediction


@app.route('/hello')
def hello_world():  # put application's code here
    return 'Hello World!'


@app.route('/color', methods=['POST'])
def index():  # put application's code here
    try:
        image = request.files['image']
        image.save('temp.jpg')  # Save the uploaded image temporarily
        color_result = classify_color('temp.jpg')
        os.remove('temp.jpg')  # Remove the temporary image
        return jsonify({'color': color_result})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run()
