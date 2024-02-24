### What is the project is about ?

1. Users can compare betweeen two versions of the same tables
2. See the full comparaison between each table column in details
3. Filter just the Different rows
4. export the results as a PDF or CSV

### How to run the app?

1. Clone this repository in your local machine

## Backend : dbtablescomparatorapi

1. Make sure you have Oracle Database started ,`https://dev.to/pazyp/oracle-19c-with-docker-36m5` , `https://github.com/oracle/docker-images/blob/main/OracleDatabase/SingleInstance/README.md`
2. Install maven `https://www.baeldung.com/install-maven-on-windows-linux-mac`
3. inside of `dbtablescomparatorapi/src/main/resources/application.yml` replace the database propreties with you values : `host` , `svc` , `username` , `password`
4. inside of `dbtablescomparatorapi` folder run `mvn spring-boot:run`

## FontEnd : dbtablescomparatorapi

1. make sure that the baackend has started
2. install nodejs `https://nodejs.org/en/download/current`
3. inside of `dbtablescomparatorun` folder run `npm install`
4. inside of `dbtablescomparatorun` folder run `npm start`
