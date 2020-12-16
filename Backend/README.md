**Running first time**
```bash
pip install -r requirements.txt
    (or)
py -3 -m pip install -r requirements.txt
```

  
---------------------------------------------------------------------------------------

**Every time**

To run the backend:

i) Open terminal in the root project directory VAST-2019-MC1-Sravani and Change directory to the Backend from the root directory   i.e., VAST-2019-MC1-Sravani using the following command:
```bash
cd Backend
```


        
ii) Now start the flask server using the following command     depending on your configuration:
```bash
flask run 
   (or)
py -3 -m flask run
```
iii) Now, we should see a message **"Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)"** which indicates the successful start of the flask server. Keep this terminal running and proceed with the next steps.

iv) Some environments (like Mac) may ask to set the FLASK_APP environment variable explicitly. In that case set the environment variable using below commands before step (ii).
```bash
export FLASK_APP=app.py
```

----------------------------------------------------------------------------------------

***** APIs ******** 

GET requests:

To get the mean damage for a particular category:

http://localhost:5000/damage/mean/shake_intensity

http://localhost:5000/damage/mean/medical

http://localhost:5000/damage/mean/power

http://localhost:5000/damage/mean/buildings

http://localhost:5000/damage/mean/sewer_and_water

http://localhost:5000/damage/mean/roads_and_bridges




To get mean for a particular interval:
http://localhost:5000/damage/mean/<string:category>/<string:timestamp1>/<string:timestamp2>


To get entropy for a particular interval:
http://localhost:5000/damage/entropy/<string:category>/<string:timestamp1>/<string:timestamp2>


To get mean for all categories for a particular interval:
http://localhost:5000/damage/mean/allcategories/<string:timestamp1>/<string:timestamp2>

To get damage distribution for all categories and for a particular locationId:
http://localhost:5000/reportcountanddamage/<int:loc>

Timestamp is a string in the format 'YYYY-MM-DD HH:MM:SS'. For example, '2020-04-06 00:35:00'
Ex: http://localhost:5000/damage/entropy/power/'2020-04-06 00:35:00'/'2020-04-06 23:40:00'


Use the above urls in the http requests from the js files
