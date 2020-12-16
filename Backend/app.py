from flask import Flask
from flask_cors import CORS
import pandas as pd
from preprocessData import get_reports_n_damage_by_location, get_damage_mean_by_category, get_mean_by_category, get_entropy_by_category, get_damage, get_report_count

app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/damage/mean/<string:category>', methods=['GET'])
def damage_by_category(category):
    damage_mean_by_category = get_damage_mean_by_category(category)
    damage = pd.DataFrame(damage_mean_by_category)
    damage = damage.to_json(orient='records')
    return damage


@app.route('/damage/mean/<string:category>/<string:time1>/<string:time2>', methods=['GET'])
def damage_by_category_for_time_period(category, time1, time2):
    damage_mean_by_category_for_timeframe = get_mean_by_category(
        category, time1, time2)
    damage = pd.DataFrame(damage_mean_by_category_for_timeframe)
    damage = damage.to_json(orient='records')
    return damage


@app.route('/damage/entropy/<string:category>/<string:time1>/<string:time2>', methods=['GET'])
def entropy_by_category_for_time_period(category, time1, time2):
    entropy_by_category_for_timeframe = get_entropy_by_category(
        category, time1, time2)
    entropy = pd.DataFrame(entropy_by_category_for_timeframe)
    entropy = entropy.to_json(orient='records')
    return entropy


@app.route('/damage/mean/allcategories/<string:time1>/<string:time2>', methods=['GET'])
def damage_for_all_categories_for_time_period(time1, time2):
    damage_for_all_categories_for_timeframe = get_damage(time1, time2)
    damage = pd.DataFrame(damage_for_all_categories_for_timeframe)
    damage = damage.to_json(orient='records')
    return damage


@app.route('/reportcount', methods=['GET'])
def report_count():
    report_count = get_report_count()
    report_count = pd.DataFrame(report_count)
    report_count = report_count.to_json(orient='records')
    return report_count


@app.route('/reportcountanddamage/<int:loc>', methods=['GET'])
def reports_n_damage(loc):
    report_count_n_damage = get_reports_n_damage_by_location(loc)
    report_count_n_damage = pd.DataFrame(report_count_n_damage)
    report_count_n_damage = report_count_n_damage.to_json(orient='records')
    return report_count_n_damage


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
