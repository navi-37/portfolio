drop table if exists inconsist_r3;
create table inconsist_r3(
	id_sucursal int,
	id_personal int
);

drop trigger if exists r3_encargados_AI;
delimiter //
create trigger r3_encargados_AI after insert on sucursales
for each row	
begin
	declare idSucursal int;
    declare idEncargado int;
	declare mensaje varchar(255);
	set idSucursal = new.idSucursal;
	set idEncargado = new.idEncargado;
    set mensaje = concat('Insert no permitido. ', 'ID Sucursal: ', idSucursal, ', ID Personal: ', idEncargado);
    
	if idEncargado is not null then
		if not exists (
			select 1
            from personal p
            where p.idSucursal = idSucursal and p.idPersonal = idEncargado and p.activo = true
            ) then
				SIGNAL sqlstate '45000'
                set message_text = mensaje;
                insert into inconsist_r3(id_sucursal, id_personal) values (idSucursal, idEncargado);
                -- el insert no funciona por problemas con el signal, lo charlamos en clase y se indicó dejarlo así
            end if;
    end if;
end //

drop trigger if exists r3_encargados_AU;
delimiter //
create trigger r3_encargados_AU after update on sucursales
for each row	
begin
	declare idSucursal int;
    declare idEncargado int;
	declare mensaje varchar(255);
	set idSucursal = new.idSucursal;
	set idEncargado = new.idEncargado;
    set mensaje = concat('Update no permitido. ', 'ID Sucursal: ', idSucursal, ', ID Personal: ', idEncargado);
    
	if idEncargado is not null then
		if not exists (
			select 1
            from personal p
            where p.idSucursal = idSucursal and p.idPersonal = idEncargado and p.activo = true
            ) then
				SIGNAL sqlstate '45000'
                set message_text = mensaje;
                insert into inconsist_r3(id_sucursal, id_personal) values (idSucursal, idEncargado);
                -- el insert no funciona por problemas con el signal, lo charlamos en clase y se indicó dejarlo así
            end if;
    end if;
end //