drop procedure if exists balance_cliente;
delimiter //
create procedure balance_cliente(
	in id_cliente int,
    in fecha timestamp,
    out saldo float)
begin
    declare recargo float default 0;
    declare descuento float default 0;
    declare devolucion_fecha date;
    declare alquiler_fecha date;
    declare duracion_alquiler int;
    declare hay_datos boolean default true;
    
    declare cur2 cursor for (
		select A.fechaDevolucion,  A.fecha, P.duracionAlquiler
		from alquileres A join peliculas P on A.idPelicula = P.idPelicula
		where A.idCliente = id_cliente
    );
    
	declare continue handler for sqlstate '02000' set hay_datos = false;
    
    set @saldo = 0;
    set @recargo = 0;
    set @descuento =0;

    open cur2;
    fetch cur2 into devolucion_fecha, alquiler_fecha, duracion_alquiler;
    -- para cada pelicula que alquiló un cliente nos fijamos
    while hay_datos do
		-- si hay atraso y éste es mayor al triple de la duración del alquiler se cobra el costo de reemplazo de la película
		if devolucion_fecha > DATE_ADD(alquiler_fecha, INTERVAL (duracion_alquiler * 3) DAY) THEN
			set @recargo = @recargo + (	select sum(P.costoReemplazo)
						from alquileres as A join peliculas as P on A.idPelicula = P.idPelicula
                        where (date_add(A.fecha, interval (P.duracionAlquiler * 3) day) > A.fechaDevolucion) and A.idCliente = id_cliente);
		-- si el atraso no supera el triple de la dur_alq, pero hay días de atraso cobramos $5 por dia
		else if devolucion_fecha > DATE_ADD(alquiler_fecha, INTERVAL duracion_alquiler DAY) THEN
			set @recargo = @recargo + (	select sum(timestampdiff(day, A.fechaDevolucion, date_add(A.fecha, interval P.duracionAlquiler day))) * 5
								from alquileres as A join peliculas as P on A.idPelicula = P.idPelicula
								where (date_add(A.fecha, interval P.duracionAlquiler day) > A.fechaDevolucion) and A.idCliente = id_cliente);
		end if;
		end if;
        fetch cur2 into devolucion_fecha, alquiler_fecha, duracion_alquiler;
    end while;
    close cur2;
    
    -- seteamos saldo como la suma de los costos de alquiler de todos los alquileres realizados antes de la fecha de cálculo
    set @saldo = (	select sum(P.costoAlquiler)
                    from alquileres A join peliculas P on A.idPelicula = P.idPelicula
                    where A.idCliente = id_cliente and A.fecha < fecha);
                    
    -- seteamos descuento como la suma de los montos que el cliente pagó previo a la fecha de cálculo
    set @descuento = (	select sum(monto)
						from pagos P
						where P.idClienteAlquilo = id_cliente and P.fecha < fecha
                        );
	
    set @saldo = @saldo + @recargo - @descuento;
    set saldo = @saldo;
end //

drop table if exists balance;
create table balance(
	id int not null auto_increment,
    id_cliente int,
    fecha_calculo date,
    saldo float,
    primary key(id)
)

drop procedure if exists balance_clientes;
delimiter //
create procedure balance_clientes(
    in fecha timestamp
    )
begin
	declare idCliente int;
    declare hay_datos boolean default true;
    
    declare cur1 cursor for(	select C.idCliente
								from clientes C);
                                
	declare continue handler for sqlstate '02000' set hay_datos = false;
    open cur1;
    fetch cur1 into idCliente;
    while hay_datos do
		call balance_cliente(idCliente, fecha, @saldo);
        insert into balance(id_cliente, fecha_calculo, saldo) values 
        (idCliente, fecha, @saldo);
        fetch cur1 into idCliente;
	end while;
    close cur1;
end //

call balance_clientes(now());
select * from balance; 
