
CREATE TABLE THEATRE_GOOD(
	THEATRE_GOOD_ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    NAME VARCHAR(25) NOT NULL,
    DESCRIPTION VARCHAR(1000) NOT NULL,
    LOCATION VARCHAR(300) NOT NULL
);

ALTER TABLE THEATRE_GOOD AUTO_INCREMENT = 470;

CREATE TABLE IMAGE(
	IMAGE_ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    VALUE  VARCHAR(150) NOT NULL,
    THEATRE_GOOD_ID INT,
    NAME VARCHAR(64) NOT NULL,
    FOREIGN KEY(THEATRE_GOOD_ID) REFERENCES THEATRE_GOOD(THEATRE_GOOD_ID)
);

CREATE TABLE STORY(
	STORY_ID INT NOT NULL PRIMARY KEY ,
    VALUE  VARCHAR(25) NOT NULL UNIQUE
);


INSERT INTO STORY(STORY_ID, VALUE) VALUES (0, 'BASEMENT');
INSERT INTO STORY(STORY_ID, VALUE) VALUES (1, 'FIRST');
INSERT INTO STORY(STORY_ID, VALUE) VALUES (2, 'SECOND');
INSERT INTO STORY(STORY_ID, VALUE) VALUES (3, 'THIRD');
INSERT INTO STORY(STORY_ID, VALUE) VALUES (4, 'OUTSIDE');

CREATE TABLE AREA(
	AREA_ID INT NOT NULL PRIMARY KEY,
    FOREIGN KEY(AREA_ID) REFERENCES THEATRE_GOOD(THEATRE_GOOD_ID),
	STORY_ID INT NOT NULL,
    FOREIGN KEY(STORY_ID) REFERENCES STORY(STORY_ID)
);

CREATE TABLE ELEMENT(
	ELEMENT_ID INT NOT NULL PRIMARY KEY,
    FOREIGN KEY(ELEMENT_ID) REFERENCES THEATRE_GOOD(THEATRE_GOOD_ID),
    AREA_ID INT NOT NULL,
    FOREIGN KEY(AREA_ID) REFERENCES AREA(AREA_ID)
);



INSERT INTO THEATRE_GOOD (NAME, DESCRIPTION, LOCATION) VALUES ('Palco derecho', 'Esta zona se encuenta un nivel por encima del escenario. Decorado con detalles de oro y estatuas renacentistas en la cornisa. Cortina roja separa el pasillo interno del palco. Cuenta con butacas individuales.', 'Al lado derecho del escenario, en lo alto colindante con el palco intermedio');
INSERT INTO AREA (AREA_ID, STORY_ID) VALUES (last_insert_id(), 3);

INSERT INTO IMAGE (VALUE, THEATRE_GOOD_ID, NAME) VALUES ('https://foyer-administration.s3.amazonaws.com/Palco+derecho+vista+frontal.jpg', 470, 'Palco derecho vista frontal.jpg'),
                                                     ('https://foyer-administration.s3.amazonaws.com/Palco+derecho+vista+a%C3%A9rea.jpeg', 470, 'Palco derecho vista aérea.jpeg');

INSERT INTO THEATRE_GOOD(NAME, DESCRIPTION, LOCATION) VALUES ('Cortina', 'Este elemento tiene como objetivo separar el pasillo interno y el palco, esta cortina es de color rojo y cuenta con boradados dorados. Argollas metálicas la sostienen.', 'Entrada');
INSERT INTO ELEMENT (ELEMENT_ID, AREA_ID) VALUES (LAST_INSERT_ID(), 470);

INSERT INTO IMAGE (VALUE, THEATRE_GOOD_ID, NAME) VALUES ('https://foyer-administration.s3.amazonaws.com/Cortina.jpg', 471, 'Cortina.jpg')

# INSERT INTO THEATRE_GOOD(NAME, DESCRIPTION, LOCATION) VALUES ('Cornisa', 'Este elemento tiene como objetivo decorar la parte exterior del balcón y es de color blanco.', 'Limite exterior');
# INSERT INTO ELEMENT (ELEMENT_ID, AREA_ID) VALUES (LAST_INSERT_ID(), 470);
#
# INSERT INTO THEATRE_GOOD (NAME, DESCRIPTION, LOCATION) VALUES ('Bodega de cerámica', 'Esta zona alberga las artesanías en cerámica que no se encuentran actualmente en exposición.', 'En la sala A1, a la derecha de las escaleras');
# INSERT INTO AREA (AREA_ID, STORY_ID) VALUES (last_insert_id(), 0);
#
# INSERT INTO THEATRE_GOOD(NAME, DESCRIPTION, LOCATION) VALUES ('Ceramica olmeca pequeña', 'Se trata de un cajete, cuenco, escudilla o tecomate de base plana y paredes rectas, que al parecer procede de alguna aldea de la Cuenca de México como Coapexco, Tlatilco o Zohapilco-Tlapacoya, y data de la fase Ayotla (1250-1000 a.C.), período que fue definido por los arqueólogos Paul Tolstoy y Louise I. Paradis en 1970. Aparentemente puede suscribirse dentro de la categoría Volcán pulido, donde dicho tipo de vasijas se caracterizan por su superficie lisa, cocida en atmósfera de humo, con superficies bien pulidas, de tonos negros u ocres oscuros, con diseños excisos o incisos antes de la cocción, generalmente rellenos con pigmento rojo que podría ser de cinabrio o hematita especular.', 'Primer estante, segunda repisa');
# INSERT INTO ELEMENT (ELEMENT_ID, AREA_ID) VALUES (LAST_INSERT_ID(), 473);
#
# INSERT INTO THEATRE_GOOD(NAME, DESCRIPTION, LOCATION) VALUES ('Cornisa', 'Este elemento tiene como objetivo decorar la parte exterior del balcón y es de color blanco.', 'Limite exterior');
# INSERT INTO ELEMENT (ELEMENT_ID, AREA_ID) VALUES (LAST_INSERT_ID(), 534);
