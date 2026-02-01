-- Obligatorio BD1 Matutino 2023
--Consultas elegidas: 1, 5, 7, 9, 10, 12.

-- Consulta 1: Encontrar los nombres completos de las personas que han comprado todos
-- los camiones que previamente alquilaron (usar solo la fecha de inicio 
-- del alquiler). Tomar solo en cuenta personas que hayan alquilado al menos
-- 2 camiones distintos.

SELECT P.Nombre, P.Apellido
FROM PERSONAS AS P
WHERE NOT EXISTS (SELECT *
                  FROM (ALQUILERES NATURAL JOIN VEHICULOS) AS AV
                  WHERE AV.CI=P.CI AND AV.Tipo='Camión' AND NOT EXISTS
				  (	SELECT *
					FROM CONTRATOS AS C
					WHERE AV.FechaIni<C.Fecha AND P.CI=C.CI AND AV.CodVeh=C.CodVeh))
INTERSECT
SELECT VAxPS.Nombre, VAxPS.Apellido
FROM ((VEHICULOS NATURAL JOIN ALQUILERES) NATURAL JOIN PERSONAS) AS VAxPS
WHERE VAxPS.Tipo='Camión'
GROUP BY VAxPS.Nombre, VAxPS.Apellido
HAVING COUNT (DISTINCT VAxPS.CodVeh) > 1;



-- Consulta 5: Para cada cliente, encontrar las sucursales en las que han 
-- realizado la mayor cantidad de alquileres de vehículos 
-- distintos, tomando solo en cuenta vehículos que actualmente 
-- no están alojados en dichas sucursales, y tampoco se 
-- encuentran disponibles para ser alquilados.

SELECT A1.CI, A1.Sucursal, COUNT(A1.CodVeh) 
FROM ALQUILERES as A1
WHERE A1.CodVeh IN ((SELECT DISTINCT CodVeh --De los vehículos alquilables
				FROM ALQUILERES)
				EXCEPT
				(SELECT CodVeh --Se restan los que estan habilitados para alquilarse
				FROM HAB_ALQ)
				) AND A1.CodVeh IN (SELECT ALQ1.CodVeh
								FROM ALQUILERES AS ALQ1
								JOIN VEHICULOS AS V1 ON ALQ1.CodVeh = V1.CodVeh 
								WHERE V1.Sucursal <> ALQ1.Sucursal) -- Vehículos que actualmente no están alojados en dichas sucursales
GROUP BY A1.CI, A1.Sucursal
HAVING COUNT(A1.CodVeh) >= ALL (SELECT COUNT(A2.CodVeh)
							   FROM ALQUILERES as A2
							   WHERE  A1.CI = A2.CI  and   ---joineo con cedula para saber que es el cliente en el que estoy parado actualemnte
							   A2.CodVeh IN ((SELECT DISTINCT CodVeh
										  FROM ALQUILERES)
										  EXCEPT
										  (SELECT CodVeh
										   FROM HAB_ALQ)
										  ) 
							   AND A2.CodVeh IN (SELECT ALQ2.CodVeh
											   FROM ALQUILERES AS ALQ2
											   JOIN VEHICULOS AS V2 ON ALQ2.CodVeh = V2.CodVeh
											   WHERE V2.Sucursal <> ALQ2.Sucursal)
							   GROUP BY A2.CI, A2.Sucursal   ---agrupo para determinar cantidad de vehiculos distintos alquilados por sucursal, y quedarme con el mayor valor de ellos.
		 );							

-- Consulta 7: Desplegar toda la información de los vehículos para los cuales existen al menos 2 ventas
-- distintas, cumpliendo para ambas que el vehículo no fue alquilado entre la fecha de venta y la
-- fecha de adquisición anterior correspondiente (la última adquisición antes de dicha venta)

SELECT V.CodVeh, V.Modelo, V.Sucursal, V.Tipo, V.Tonelaje
FROM VEHICULOS as V
JOIN ADQUISICIONES as A1 ON V.CodVeh = A1.CodVeh
JOIN CONTRATOS as C1 ON V.CodVeh = C1.CodVeh AND A1.Fecha < C1.Fecha
JOIN ADQUISICIONES as A2 ON V.CodVeh = A2.CodVeh AND C1.Fecha < A2.Fecha
JOIN CONTRATOS as C2 ON V.CodVeh = C2.CodVeh AND A2.Fecha < C2.Fecha
WHERE NOT EXISTS (
    SELECT *
    FROM ALQUILERES as ALQ1
    WHERE V.CodVeh = ALQ1.CodVeh AND ALQ1.FechaIni BETWEEN A1.Fecha AND C1.Fecha
)
AND NOT EXISTS (
    SELECT *
    FROM ALQUILERES as ALQ2
    WHERE V.CodVeh = ALQ2.CodVeh AND ALQ2.FechaIni BETWEEN A2.Fecha AND C2.Fecha
)
ORDER BY V.CodVeh;


-- Consulta 9: Encontrar qué vehículos cumplen con algunos de los siguientes puntos:
-- 1- Tienen 2 alquileres simultáneos.
-- 2- Fueron vendidos mientras estaban siendo alquilados.
-- 3- Fueron adquiridos nuevamente sin antes haber sido vendidos.
-- 4- Fueron vendidos o alquilados sin antes haber sido (adecuadamente) adquiridos.


-- 1- Tienen 2 alquileres simultáneos.
SELECT A1.CodVeh
FROM ALQUILERES AS A1 JOIN ALQUILERES AS A2 ON A1.CodVeh=A2.CodVeh AND A1.CI<>A2.CI
WHERE A1.FechaIni<=A2.FechaIni AND A2.FechaIni<=A1.FechaFin 

UNION

-- 2- Fueron vendidos mientras estaban siendo alquilados.
SELECT A.CodVeh
FROM ALQUILERES AS A JOIN CONTRATOS AS C ON A.CodVeh=C.CodVeh AND A.CI<>C.CI
WHERE A.FechaIni<=C.Fecha and A.FechaFin>=C.Fecha 

UNION

-- 3- Fueron adquiridos nuevamente sin antes haber sido vendidos.
SELECT DISTINCT AN1.CodVeh
FROM ADQUISICIONES AS AN1 JOIN ADQUISICIONES AS AN2 ON (AN1.CodVeh=AN2.CodVeh AND AN1.Fecha<AN2.Fecha)
WHERE AN1.CodVeh NOT IN (SELECT AN3.CodVeh
                         FROM CONTRATOS AS AN3
                         WHERE AN1.CodVeh=AN3.CodVeh AND AN3.Fecha<AN2.Fecha AND AN3.Fecha>AN1.Fecha)

UNION

-- 4-Fueron vendidos o alquilados sin antes haber sido (adecuadamente) adquiridos.
SELECT DISTINCT CON.CodVeh--, CON.Sucursal, CON.Fecha, ADQ.Fecha
FROM (CONTRATOS JOIN SUCURSALES ON sucursal = nombre) as CON JOIN ADQUISICIONES AS ADQ ON  CON.CodVeh = ADQ.CodVeh
WHERE  (ADQ.Fecha = (SELECT MAX(AD1.Fecha)
						FROM ADQUISICIONES AD1 
						WHERE AD1.Fecha < CON.FechA))
						AND ADQ.Automotora <> CON.Automotora
UNION                      
SELECT DISTINCT ALQ.CodVeh--, ALQ.Sucursal, ALQ.FechaIni
FROM (ALQUILERES JOIN SUCURSALES ON sucursal = nombre) as ALQ JOIN ADQUISICIONES AS ADQ2 ON ALQ.CodVeh = ADQ2.CodVeh
WHERE  (ADQ2.Fecha = (SELECT MAX(AD1.Fecha)
						FROM ADQUISICIONES AD1 
						WHERE AD1.Fecha < ALQ.FechaIni))
                      	AND ADQ2.Automotora <> ALQ.Automotora
;
						
--Consulta 10: Encontrar el nombre completo y teléfono de la persona que haya gastado la mayor cantidad de
--dinero, tomando en cuenta tanto sus compras como sus alquileres de vehículos.
--Indicar también el monto gastado por dicha persona.
--Nota: Se pueden utilizar subconsultas en el FROM.
--Nota: Al igual que en otros casos, tomar en cuenta que pueden haber empates.


SELECT SC.Nombre, SC.Apellido, SC.Telefono, SUM(SC.SUMA) AS SUMATOTAL
FROM(
	SELECT P.CI, P.Nombre, P.Apellido, P.Telefono, SUM(ALQ.CostoTotal) AS SUMA
	FROM PERSONAS AS P JOIN ALQUILERES AS ALQ ON P.CI = ALQ.CI
	GROUP BY P.CI, P.Nombre, P.Apellido, P.Telefono

	UNION ALL

	SELECT P.CI, P.Nombre, P.Apellido, P.Telefono, SUM(C.Precio) AS SUMA
	FROM PERSONAS AS P JOIN CONTRATOS AS C ON P.CI = C.CI
	GROUP BY P.CI, P.Nombre, P.Apellido, P.Telefono 
	)AS SC	
GROUP BY SC.Nombre, SC.Apellido, SC.Telefono
HAVING SUM(SC.SUMA) =	(SELECT MAX(SUMATOTAL)
						FROM(	SELECT SC.CI, SUM(SC.SUMA) AS SUMATOTAL
							FROM(	SELECT P.CI, SUM(ALQ.CostoTotal) AS SUMA
									FROM PERSONAS AS P JOIN ALQUILERES AS ALQ ON P.CI = ALQ.CI
									GROUP BY P.CI

									UNION ALL

									SELECT P.CI, SUM(C.Precio) AS SUMA
									FROM PERSONAS AS P JOIN CONTRATOS AS C ON P.CI = C.CI
									GROUP BY P.CI 
									)AS SC	
									GROUP BY SC.CI
						) AS PONELE)
						
						
-- Consulta 12: Para cada automotora calcular el dinero ganado alquilando vehículos,
-- tomando solo en cuenta alquileres que cumplan que al momento del alquiler,
-- el vehículo pertenecía a la automotora. Para realizar el chequeo, 
-- la fecha del alquiler debe ser posterior a una adquisición de dicho 
-- vehículo por parte de la automotora, y no debe haber una venta de dicho
-- vehículo entre ambas fechas.

SELECT DISTINCT SUC.Automotora, SUM(ALQ.CostoTotal)
FROM SUCURSALES as SUC
JOIN ALQUILERES as ALQ on SUC.Nombre = ALQ.Sucursal
JOIN ADQUISICIONES as ADQ on ADQ.Automotora = SUC.Automotora
LEFT JOIN CONTRATOS as CON on CON.Sucursal = SUC.Nombre
WHERE 	ADQ.CodVeh=ALQ.CodVeh and
		ADQ.Fecha < ALQ.FechaIni and 
		CON.Fecha NOT BETWEEN ADQ.Fecha and ALQ.FechaIni
GROUP BY SUC.Automotora;
