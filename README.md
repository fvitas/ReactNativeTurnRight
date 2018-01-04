# ReactNativeTurnRight


### Generate and sign android apk

- add local.properties file in /android folder
    ```
     sdk.dir = /Users/nameHere/Library/Android/sdk
    ```
    
- add keystore.properties file in /android folder
   ```
   storeFile=release-key.keystore
   keyAlias=release-key-alias
   storePassword=***
   keyPassword=***
   ```

- generate .keystore file and place it under /android/app folder
    ```
    sudo keytool -genkey -v -keystore release-key.keystore -alias release-key-alias -keyalg RSA -keysize 2048 -validity 10000
    ```
    
- run command 
    ```
    cd android && ./gradlew assembleRelease
    ```