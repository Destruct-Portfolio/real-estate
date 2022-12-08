
  _____            _            ______     _        _                  ____   ____ _______ 
 |  __ \          | |          |  ____|   | |      | |                |  _ \ / __ \__   __|
 | |__) |___  __ _| |  ______  | |__   ___| |_ __ _| |_ ___   ______  | |_) | |  | | | |   
 |  _  // _ \/ _` | | |______| |  __| / __| __/ _` | __/ _ \ |______| |  _ <| |  | | | |   
 | | \ \  __/ (_| | |          | |____\__ \ || (_| | ||  __/          | |_) | |__| | | |   
 |_|  \_\___|\__,_|_|          |______|___/\__\__,_|\__\___|          |____/ \____/  |_|   
                                                                                           
                                                                                           
the application will scrape multiple real-estate websites and collects over 200 AD link on each websites, 
then will scrape more information for each AD link and the output will be saved in its Proper json file 
with the domain name of the webiste as the json file name and will make sure there is no duplicates between
the new ads and the allready saved ads.

### prerequisite
  you will need to have node installed in your system if not check the link below to see how to instlal it 
  https://radixweb.com/blog/installing-npm-and-nodejs-on-windows-and-mac

  node 
    
    ``` 
      node -v 
      v18.12.1
    
    ```
### setup 
  before starting the script you need to install all the depencies nessary to correctly lunch the script

  ```
      npm install 

  ```

### starting
  to start the script simply run the command 
 
  ```
    npm start

  ```

### some explanation 

* the script will take a some time to finish, but you will be able to see the complete process of the script in the terminal.

* please do no not delete the folder data otherwise the script will fail.

* the script will run every 4 hours. 

* the AD ouput object is as you Spicified 

  ```
            Ad_Object {
              Number_Of_Rooms: string | null;
              square_meters: string | null;
              property_location: string | null;
              property_price: string | null;
              article_url: string | null;
              website_source: string | null;
              property_pictures: string[] | null;
              PhoneNumber: string | null;
            }
  ```
* 



enjoy the scirpt