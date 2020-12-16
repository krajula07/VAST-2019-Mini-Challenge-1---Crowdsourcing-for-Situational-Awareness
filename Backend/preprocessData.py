
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import time
import datetime
import functools
import collections
import math
from scipy.stats import entropy

nba = pd.read_csv("Data//mc1-reports-data.csv", parse_dates=['time'])

nba = nba.set_index('time')
nba['time'] = nba.index


def get_damage_mean_by_category(category):
    nba["time"] = pd.to_datetime(nba["time"])
    nba['hour'] = nba.time.dt.hour
    nba['date'] = nba.time.dt.date
    nba_location = nba.groupby(nba.location, as_index=False)
    locations = 0*[19]
    locations_timelyAverage = 0*[19]
    locations_timeAnalysis = 0*[19]
    for group_name, location in nba_location:
        locations_daysData = 0*[5]
        temp = nba_location.get_group(group_name).dropna(subset=[category])
        temp = temp.set_index('time')
        temp['time'] = temp.index
        locations_daysData.append(temp.loc['2020-04-06'])
        locations_daysData.append(temp.loc['2020-04-07'])
        locations_daysData.append(temp.loc['2020-04-08'])
        locations_daysData.append(temp.loc['2020-04-09'])
        locations_daysData.append(temp.loc['2020-04-10'])
        locations.append(locations_daysData)
        locations_timelyAverage.append(locations[group_name-1][2].groupby(
            locations[group_name-1][2].hour, as_index=False)[category].mean())
        locations_timeAnalysis.append(locations[group_name-1][2].groupby(
            locations[group_name-1][2].time, as_index=False)[category].mean())
    maxList = max(locations_timelyAverage, key=lambda i: len(i))
    maxLength = len(maxList)
    df = functools.reduce(lambda left, right: pd.merge(
        left, right, on='time', how='outer'), locations_timeAnalysis)
    damage = pd.DataFrame(df)
    locations = ["time", "palace_hills", "northwest", "old_town", "safe_town", "southwest", "downtown", "wilson_forest", "scenic_vista", "broadview",
                 "chapparal", "terrapin_springs", "pepper_mill", "cheddarford", "easton", "weston", "southton", "oak_willow", "east_parton", "west_parton"]
    damage.columns = locations
    return damage


def get_mean_by_category(category, t1, t2):
    mask = (nba['time'] >= t1) & (nba['time'] <= t2)
    temp = nba.loc[mask]
    nba_location = temp.groupby(temp.location, as_index=False)
    locations = 0*[19]
    locations_timelyAverage = 0*[19]
    for group_name, location in nba_location:
        temp_category = nba_location.get_group(
            group_name).dropna(subset=[category])
        locations_timelyAverage.append(
            [group_name, temp_category[category].mean()])
    df = pd.DataFrame(locations_timelyAverage)
    return df


def get_entropy_by_category(category, t1, t2):
    mask = (nba['time'] >= t1) & (nba['time'] <= t2)
    temp = nba.loc[mask]
    nba_location = temp.groupby(temp.location, as_index=False)
    locations = 0*[19]
    locations_timelyAverage = 0*[19]
    for group_name, location in nba_location:
        temp_category = nba_location.get_group(
            group_name).dropna(subset=[category])
        if temp_category.empty:
            entropy_value=None          
        else:   
            bases = collections.Counter([tmp_base for tmp_base in temp_category[category]])
            dist = [x/sum(bases.values()) for x in bases.values()]
            entropy_value = entropy(dist, base=11)
        locations_timelyAverage.append([group_name, entropy_value])
    df = pd.DataFrame(locations_timelyAverage)
    return df


def get_damage(t1, t2):
    mask = (nba['time'] >= t1) & (nba['time'] <= t2)
    temp = nba.loc[mask]
    categories = ['sewer_and_water', 'power', 'roads_and_bridges',
                  'medical', 'buildings', 'shake_intensity']
    nba_location = temp.groupby(temp.location, as_index=False)
    all_categories = 0*[6]
    locations = 0*[19]
    locations_timelyAverage = 0*[19]
    for group_name, location in nba_location:
        for category in categories:
            temp_category=nba_location.get_group(group_name).dropna(subset=[category])
            locations_timelyAverage.append([group_name,category,temp_category[category].mean()])
            df=pd.DataFrame(locations_timelyAverage)
    return df


def get_report_count():
    nba_time = nba.groupby(nba.time, as_index=False)['time'].agg(['count'])
    nba_time['log_value'] = np.log(nba_time['count'])/np.log(11)
    nba_time.reset_index(level=0, inplace=True)
    return nba_time


def get_reports_n_damage_by_location(loc):
    nba_time = nba.groupby(nba.location, as_index=False)
    location = nba_time.get_group(loc)
    temp = location.groupby(pd.Grouper(level='time', freq='3h')).agg(power=('power', 'mean'), medical=('medical', 'mean'), sewer_and_water=('sewer_and_water', 'mean'), roads_and_bridges=('roads_and_bridges', 'mean'), buildings=('buildings', 'mean'), shake_intensity=('shake_intensity', 'mean'), count=('time', 'count'))
    temp.reset_index(level=0, inplace=True)
    return temp
