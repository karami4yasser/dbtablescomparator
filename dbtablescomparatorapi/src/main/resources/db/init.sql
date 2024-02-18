
CREATE TABLE "SYS"."ORDERDETAILS"
(	"ORDERDETAILID" NUMBER(*,0),
     "ORDERID" NUMBER(*,0),
     "PRODUCTID" NUMBER(*,0),
     "QUANTITY" NUMBER(*,0),
     "PRICE" NUMBER(10,2)
) PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255
    NOCOMPRESS LOGGING
    STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
    PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
    BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
    TABLESPACE "SYSTEM" ;
--------------------------------------------------------
--  DDL for Table ORDERS
--------------------------------------------------------

CREATE TABLE "SYS"."ORDERS"
(	"ORDERID" NUMBER(*,0),
     "USERID" NUMBER(*,0),
     "ORDERDATE" DATE
) PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255
    NOCOMPRESS LOGGING
    STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
    PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
    BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
    TABLESPACE "SYSTEM" ;

CREATE TABLE "SYS"."PRODUCTCATEGORIES"
(	"PRODUCTID" NUMBER(*,0),
     "CATEGORYID" NUMBER(*,0)
) PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255
    NOCOMPRESS LOGGING
    STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
    PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
    BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
    TABLESPACE "SYSTEM" ;
--------------------------------------------------------
--  DDL for Table PRODUCTS
--------------------------------------------------------

CREATE TABLE "SYS"."PRODUCTS"
(	"PRODUCTID" NUMBER(*,0),
     "PRODUCTNAME" VARCHAR2(50 BYTE),
     "PRICE" NUMBER(10,2),
     "STOCKQUANTITY" NUMBER(*,0)
) PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255
    NOCOMPRESS LOGGING
    STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
    PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
    BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
    TABLESPACE "SYSTEM" ;


CREATE TABLE "SYS"."CATEGORIES"
(	"CATEGORYID" NUMBER(*,0),
     "CATEGORYNAME" VARCHAR2(50 BYTE)
) PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255
    NOCOMPRESS LOGGING
    STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
    PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
    BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
    TABLESPACE "SYSTEM" ;




CREATE TABLE "SYS"."USERS"
(	"USERID" NUMBER(*,0),
     "USERNAME" VARCHAR2(50 BYTE),
     "EMAIL" VARCHAR2(100 BYTE),
     "REGISTRATIONDATE" DATE
) PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255
    NOCOMPRESS LOGGING
    STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
    PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
    BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
    TABLESPACE "SYSTEM";











CREATE OR REPLACE NONEDITIONABLE PROCEDURE "SYS"."CREATEANDINSERTTEMPTABLES" (
    p_tableList VARCHAR2
) AS
    v_tableName VARCHAR2(255);
    v_sql VARCHAR2(1000);
    v_sessionId VARCHAR2(50) := REPLACE(SYS_GUID(), '-');
    v_success NUMBER := 1; -- Assume success by default

    -- Cursor to iterate through the table list
    CURSOR tableCursor IS
        SELECT trim(regexp_substr(p_tableList, '[^,]+', 1, level)) AS table_name
        FROM dual
        CONNECT BY instr(p_tableList, ',', 1, level - 1) > 0
                OR instr(p_tableList, ',', 1, level - 1) = 0;

BEGIN
    -- Iterate through the table list
    FOR tableRec IN tableCursor LOOP
            v_tableName := tableRec.table_name;

            -- Drop the temporary table if it exists
            BEGIN
                EXECUTE IMMEDIATE 'DROP TABLE temp_' || v_tableName;
            EXCEPTION
                WHEN OTHERS THEN
                    NULL; -- Ignore if the table does not exist
            END;

            -- Create the temporary table and insert data
            v_sql := 'CREATE TABLE temp_' || v_tableName || ' AS SELECT * FROM ' || v_tableName;
            BEGIN
                EXECUTE IMMEDIATE v_sql;
            EXCEPTION
                WHEN OTHERS THEN
                    DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
                    v_success := 0; -- Set success to 0 if an error occurs
                    RETURN;
            END;
        END LOOP;

    -- Print success message
    DBMS_OUTPUT.PUT_LINE('Success: ' || v_success);
END CreateAndInsertTempTables;

/
CREATE OR REPLACE NONEDITIONABLE PROCEDURE "SYS"."RUNCSCRIPT" IS
BEGIN
    DELETE FROM Users;
    DELETE FROM ProductCategories;
    DELETE FROM Categories;
    DELETE FROM OrderDetails;
    DELETE FROM Orders;
    DELETE FROM Products;

    INSERT INTO Categories (CategoryID, CategoryName) VALUES (1, 'Electronics');
    INSERT INTO Categories (CategoryID, CategoryName) VALUES (2, 'Computers');
    INSERT INTO Categories (CategoryID, CategoryName) VALUES (3, 'Audio');
    INSERT INTO Categories (CategoryID, CategoryName) VALUES (4, 'Accessories');
    INSERT INTO Categories (CategoryID, CategoryName) VALUES (5, 'Gadgets');
    INSERT INTO Categories (CategoryID, CategoryName) VALUES (6, 'Peripherals');
    INSERT INTO Categories (CategoryID, CategoryName) VALUES (7, 'Smart Devices');
    INSERT INTO Categories (CategoryID, CategoryName) VALUES (8, 'Monitors');
    INSERT INTO Categories (CategoryID, CategoryName) VALUES (9, 'Mobile Devices');
    INSERT INTO Categories (CategoryID, CategoryName) VALUES (10, 'Cameras');

    INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES (1, 'Laptop', 670.00, 50);
    INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES (2, 'Smartphone', 499.99, 100);
    INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES (3, 'Headphones', 79.99, 200);
    INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES (4, 'Tablet', 299.99, 30);
    INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES (5, 'Smartwatch', 530.00, 80);
    INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES (6, 'Camera', 599.99, 15);
    INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES (7, 'Speaker', 149.99, 50);
    INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES (8, 'Monitor', 349.99, 40);
    INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES (9, 'Keyboard', 49.99, 100);
    INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES (10, 'Mouse', 29.99, 120);

    INSERT INTO ProductCategories (ProductID, CategoryID) VALUES (1, 2);
    INSERT INTO ProductCategories (ProductID, CategoryID) VALUES (2, 9);
    INSERT INTO ProductCategories (ProductID, CategoryID) VALUES (3, 3);
    INSERT INTO ProductCategories (ProductID, CategoryID) VALUES (4, 1);
    INSERT INTO ProductCategories (ProductID, CategoryID) VALUES (5, 5);
    INSERT INTO ProductCategories (ProductID, CategoryID) VALUES (6, 10);
    INSERT INTO ProductCategories (ProductID, CategoryID) VALUES (7, 6);
    INSERT INTO ProductCategories (ProductID, CategoryID) VALUES (8, 8);
    INSERT INTO ProductCategories (ProductID, CategoryID) VALUES (9, 4);
    INSERT INTO ProductCategories (ProductID, CategoryID) VALUES (10, 6);

    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (1, 'johnDoe', 'john.doe@example.com', TO_DATE('2023-01-01', 'YYYY-MM-DD'));
    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (2, 'JaneSmith', 'jane.smith@example.com', TO_DATE('2023-02-15', 'YYYY-MM-DD'));
    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (3, 'BobJohnson', 'bob.johnson@example.com', TO_DATE('2023-03-20', 'YYYY-MM-DD'));
    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (4, 'AliceWilliams', 'Mohn.doe@example.com', TO_DATE('2023-04-10', 'YYYY-MM-DD'));
    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (5, 'CharlieBrown', 'charlie.brown@example.com', TO_DATE('2023-05-05', 'YYYY-MM-DD'));
    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (6, 'EvaDavis', 'eva.davis@example.com', TO_DATE('2023-06-12', 'YYYY-MM-DD'));
    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (7, 'MikeMiller', 'mike.miller@example.com', TO_DATE('2023-07-18', 'YYYY-MM-DD'));
    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (8, 'SophieTaylor', 'sophie.taylor@example.com', TO_DATE('2023-08-22', 'YYYY-MM-DD'));
    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (9, 'TomClark', 'tom.clark@example.com', TO_DATE('2023-09-30', 'YYYY-MM-DD'));
    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (10, 'OliviaMoore', 'john.doe@example.com', TO_DATE('2023-10-15', 'YYYY-MM-DD'));
    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (11, 'TomClark', 'chvarl@yopmail.com', TO_DATE('2023-01-12', 'YYYY-MM-DD'));

    INSERT INTO Orders (OrderID, UserID, OrderDate)
    VALUES (1, 3, TO_DATE('2023-01-05', 'YYYY-MM-DD'));

    INSERT INTO Orders (OrderID, UserID, OrderDate)
    VALUES (2, 1, TO_DATE('2023-02-18', 'YYYY-MM-DD'));

    INSERT INTO Orders (OrderID, UserID, OrderDate)
    VALUES (3, 5, TO_DATE('2023-03-25', 'YYYY-MM-DD'));

    INSERT INTO Orders (OrderID, UserID, OrderDate)
    VALUES (4, 8, TO_DATE('2023-04-15', 'YYYY-MM-DD'));

    INSERT INTO Orders (OrderID, UserID, OrderDate)
    VALUES (5, 2, TO_DATE('2023-05-10', 'YYYY-MM-DD'));

    INSERT INTO Orders (OrderID, UserID, OrderDate)
    VALUES (6, 2, TO_DATE('2023-06-20', 'YYYY-MM-DD'));

    INSERT INTO Orders (OrderID, UserID, OrderDate)
    VALUES (7, 2, TO_DATE('2023-07-28', 'YYYY-MM-DD'));

    INSERT INTO Orders (OrderID, UserID, OrderDate)
    VALUES (8, 2, TO_DATE('2023-08-30', 'YYYY-MM-DD'));

    INSERT INTO Orders (OrderID, UserID, OrderDate)
    VALUES (9, 2, TO_DATE('2023-09-10', 'YYYY-MM-DD'));

    INSERT INTO Orders (OrderID, UserID, OrderDate)
    VALUES (10, 6, TO_DATE('2023-10-05', 'YYYY-MM-DD'));


    INSERT INTO OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, Price) VALUES (1, 1, 2, 2, 999.98);
    INSERT INTO OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, Price) VALUES (2, 1, 4, 1, 299.99);
    INSERT INTO OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, Price) VALUES (3, 2, 1, 1, 899.99);
    INSERT INTO OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, Price) VALUES (4, 2, 5, 3, 389.97);
    INSERT INTO OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, Price) VALUES (5, 3, 3, 5, 399.95);
    INSERT INTO OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, Price) VALUES (6, 3, 7, 2, 299.98);
    INSERT INTO OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, Price) VALUES (7, 4, 6, 1, 599.99);
    INSERT INTO OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, Price) VALUES (8, 5, 8, 3, 1049.97);
    INSERT INTO OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, Price) VALUES (9, 6, 10, 4, 119.96);
    INSERT INTO OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, Price) VALUES (10, 7, 9, 2, 99.98);


END;

/
--------------------------------------------------------
--  DDL for Procedure RUNJAVASCRIPT
--------------------------------------------------------
set define off;

CREATE OR REPLACE NONEDITIONABLE PROCEDURE "SYS"."RUNJAVASCRIPT" AS
BEGIN
    -- Clear existing data from tables
    DELETE FROM Users;
    DELETE FROM ProductCategories;
    DELETE FROM Categories;
    DELETE FROM OrderDetails;
    DELETE FROM Orders;
    DELETE FROM Products;

    INSERT INTO Categories (CategoryID, CategoryName) VALUES (1, 'Electronics');
    INSERT INTO Categories (CategoryID, CategoryName) VALUES (2, 'Computers');
    INSERT INTO Categories (CategoryID, CategoryName) VALUES (3, 'Electronics');
    INSERT INTO Categories (CategoryID, CategoryName) VALUES (4, 'Accessories');
    INSERT INTO Categories (CategoryID, CategoryName) VALUES (5, 'Gadgets');
    INSERT INTO Categories (CategoryID, CategoryName) VALUES (6, 'Peripherals');
    INSERT INTO Categories (CategoryID, CategoryName) VALUES (7, 'Smart Devices');
    INSERT INTO Categories (CategoryID, CategoryName) VALUES (8, 'Monitors');
    INSERT INTO Categories (CategoryID, CategoryName) VALUES (9, 'Mobile Devices');
    INSERT INTO Categories (CategoryID, CategoryName) VALUES (10, 'Cameras');

    INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES (1, 'Laptop', 670.00, 50);
    INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES (2, 'Smartphone', 459.99, 700);
    INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES (3, 'Headphones', 79.99, 200);
    INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES (4, 'Smartphone', 999.99, 130);
    INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES (5, 'Smartwatch', 530.00, 80);
    INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES (6, 'Camera', 599.99, 15);
    INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES (7, 'Camera', 149.99, 50);
    INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES (8, 'Monitor', 349.99, 40);
    INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES (9, 'Smartphone', 49.99, 100);
    INSERT INTO Products (ProductID, ProductName, Price, StockQuantity) VALUES (10, 'Mouse', 29.99, 120);


    INSERT INTO ProductCategories (ProductID, CategoryID) VALUES (1, 2);
    INSERT INTO ProductCategories (ProductID, CategoryID) VALUES (2, 9);
    INSERT INTO ProductCategories (ProductID, CategoryID) VALUES (3, 3);
    INSERT INTO ProductCategories (ProductID, CategoryID) VALUES (4, 1);
    INSERT INTO ProductCategories (ProductID, CategoryID) VALUES (5, 5);
    INSERT INTO ProductCategories (ProductID, CategoryID) VALUES (6, 10);
    INSERT INTO ProductCategories (ProductID, CategoryID) VALUES (7, 6);
    INSERT INTO ProductCategories (ProductID, CategoryID) VALUES (8, 8);
    INSERT INTO ProductCategories (ProductID, CategoryID) VALUES (9, 4);
    INSERT INTO ProductCategories (ProductID, CategoryID) VALUES (10, 6);

    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (1, 'johnDoe', 'john.doe@example.com', TO_DATE('2023-01-01', 'YYYY-MM-DD'));
    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (2, 'JaneSmith', 'Mane.smith@example.com', TO_DATE('2023-02-15', 'YYYY-MM-DD'));
    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (3, 'BobJohnson', 'bob.johnson@example.com', TO_DATE('2023-03-20', 'YYYY-MM-DD'));
    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (4, 'AliceWilliams', 'Mohn.doe@example.com', TO_DATE('2023-09-10', 'YYYY-MM-DD'));
    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (5, 'AliceWilliams', 'charlie.brown@example.com', TO_DATE('2023-03-05', 'YYYY-MM-DD'));
    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (6, 'EvaDavis', 'era.davis@example.com', TO_DATE('2023-06-12', 'YYYY-MM-DD'));
    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (7, 'AliceWilliams', 'tike.miller@example.com', TO_DATE('2023-07-18', 'YYYY-MM-DD'));
    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (8, 'SophieTaylor', 'ffgptrie.taylor@example.com', TO_DATE('2023-05-22', 'YYYY-MM-DD'));
    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (9, 'TomClark', 'tom.cltark@example.com', TO_DATE('2023-09-30', 'YYYY-MM-DD'));
    INSERT INTO Users (UserID, UserName, Email, RegistrationDate) VALUES (10, 'OliviaMoore', 'john.doe@texample.com', TO_DATE('2023-10-15', 'YYYY-MM-DD'));



    INSERT INTO Orders (OrderID, UserID, OrderDate) VALUES (1, 3, TO_DATE('2023-01-15', 'YYYY-MM-DD'));
    INSERT INTO Orders (OrderID, UserID, OrderDate) VALUES (2, 1, TO_DATE('2023-02-18', 'YYYY-MM-DD'));
    INSERT INTO Orders (OrderID, UserID, OrderDate) VALUES (3, 5, TO_DATE('2023-03-15', 'YYYY-MM-DD'));
    INSERT INTO Orders (OrderID, UserID, OrderDate) VALUES (4, 8, TO_DATE('2023-04-15', 'YYYY-MM-DD'));
    INSERT INTO Orders (OrderID, UserID, OrderDate) VALUES (5, 2, TO_DATE('2023-05-17', 'YYYY-MM-DD'));
    INSERT INTO Orders (OrderID, UserID, OrderDate) VALUES (6, 7, TO_DATE('2023-06-20', 'YYYY-MM-DD'));
    INSERT INTO Orders (OrderID, UserID, OrderDate) VALUES (7, 9, TO_DATE('2023-07-28', 'YYYY-MM-DD'));
    INSERT INTO Orders (OrderID, UserID, OrderDate) VALUES (8, 4, TO_DATE('2023-08-20', 'YYYY-MM-DD'));
    INSERT INTO Orders (OrderID, UserID, OrderDate) VALUES (9, 10, TO_DATE('2023-09-10', 'YYYY-MM-DD'));
    INSERT INTO Orders (OrderID, UserID, OrderDate) VALUES (10, 6, TO_DATE('2023-10-05', 'YYYY-MM-DD'));

    INSERT INTO OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, Price)
    VALUES (1, 1, 2, 2, 99.98);

    INSERT INTO OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, Price)
    VALUES (2, 1, 4, 1, 299.99);

    INSERT INTO OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, Price)
    VALUES (3, 2, 1, 1, 899.99);

    INSERT INTO OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, Price)
    VALUES (4, 2, 5, 3, 389.97);

    INSERT INTO OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, Price)
    VALUES (5, 3, 3, 5, 399.95);

    INSERT INTO OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, Price)
    VALUES (6, 3, 7, 2, 29.98);

    INSERT INTO OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, Price)
    VALUES (7, 4, 6, 1, 59.99);

    INSERT INTO OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, Price)
    VALUES (8, 5, 8, 3, 49.97);

    INSERT INTO OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, Price)
    VALUES (9, 6, 10, 4, 119.96);

    INSERT INTO OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, Price)
    VALUES (10, 7, 9, 2, 99.98);

    -- Commit the changes to the database
    COMMIT;
END RunJavaScript;

/
