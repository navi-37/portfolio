drop table if exists audit_insercion_peliculas;
create table audit_insercion_peliculas(
	idPelicula int,
    titulo varchar(255),
    descripcion text,
    anio year,
    idIdiomaOriginal int,
    duracionAlquiler int,
    costoAlquiler decimal(4, 2),
    duracion int,
    costoReemplazo decimal(5, 2),
    clasificacion enum('G','PG','PG-13','R','NC-17'),
    contenidosExtra text,
    usuario varchar(255),
    fecha datetime
);

drop table if exists inconsist_tot_pel;
create table inconsist_tot_pel(
	id_alerta SERIAL NOT NULL AUTO_INCREMENT,
	id_pelicula int);

-- TRIGGER 1
drop trigger if exists peliculas_AI;
delimiter //
create trigger peliculas_AI after insert on peliculas
for each row 
	begin
		insert into audit_insercion_peliculas(
			idPelicula, 
			titulo, 
            descripcion, 
            anio, 
            idIdiomaOriginal, 
            duracionAlquiler, 
            costoAlquiler, 
            duracion, 
            costoReemplazo, 
            clasificacion, 
            contenidosExtra, 
            usuario, 
            fecha)
		values(	new.idPelicula,
				new.titulo,
                new.descripcion,
                new.anio,
                new.idIdiomaOriginal,
                new.duracionAlquiler,
                new.costoAlquiler,
                new.duracion,
                new.costoReemplazo,
                new.clasificacion,
                new.contenidosExtra,
                current_user(),
                now()
		);
    end //

    
-- TRIGGER 2
drop trigger if exists idioma_pelis_AI;
delimiter // 
create trigger idioma_pelis_AI after insert on idiomasDePeliculas
for each row
	begin
		delete from audit_insercion_peliculas 
		where idPelicula = new.idPelicula;
	end //

	
-- TRIGGER 3
drop trigger if exists tot_peliculas;
delimiter //
create trigger tot_peliculas after insert on peliculas
for each row
	begin
		insert into inconsist_tot_pel (id_pelicula)
		values (new.idPelicula);
	end //


-- TRIGGER 4
drop trigger if exists tot_peliculas_borrar;
delimiter //
create trigger tot_peliculas_borrar after insert on idiomasDePeliculas
for each row
	begin
		delete from inconsist_tot_pel
		where id_pelicula = new.idPelicula;
	end //