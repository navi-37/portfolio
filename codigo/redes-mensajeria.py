import socket
import time
import sys
import hashlib
import threading # librería para poder bifurcar el programa
import signal
import os

# telnetlib quedó deprecado a partir de Python 3.13 pero funciona en versiones anteriores
try:
    import telnetlib
except ImportError:
    telnetlib = None  # desactiva la autenticación remota si se ejecuta con una versión moderna de python

MAX_LARGO_MENSAJE = 255 # 255 bytes como tamaño máximo de paquete que vamos a enviar, cualquier mensaje que lo supere será enviado en más de un chunk
stop_event = threading.Event() #se crea el evento para luego poder cerrar todos los hilos con la funcion salir

def emisor(puerto,nom):
    sckt = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) #socket udp
    sckt.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    
    print("\nSistema de Mensajería UDP/TCP mediante web sockets")
    print("Formato de mensajes:")
    print("- Mensaje directo: <IPdestino> <mensaje>")
    print("- Broadcast: * <mensaje>")
    print("- Enviar archivo: <IPdestino> & <ruta_archivo>")
    print("- Salir: control+c\n")

    while not stop_event.is_set():
        try:
            msg = input(f"[{nom}]> ").strip()
            if stop_event.is_set():
                break
            if not msg:
                continue

            # parsear mensaje
            partes = msg.split(' ', 1)
            if len(partes) < 2:
                print("Error: Formato incorrecto. Use: <IP> <mensaje> o * <mensaje>")
                continue
            
            destino, mensaje = partes[0], partes[1]
            
            if destino == '*': # Broadcast
                try:
                    hostname = socket.gethostname()
                    IPAddr = socket.gethostbyname(hostname)
                    ipPartida = IPAddr.split('.', 3)
                    if len(ipPartida) != 4:
                        print("Error: No se pudo determinar la IP de broadcast")
                        continue
                    destino = ipPartida[0]+"."+ipPartida[1]+"."+ipPartida[2]+".255"
                    msg_formateado = f"{IPAddr} ({nom}) dice: {mensaje}"
                    sckt.sendto(msg_formateado.encode('utf-8'), (destino, int(puerto)))
                    print(f"Broadcast enviado a {destino}")
                except Exception as e:
                    print(f"Error en broadcast: {e}")

            elif mensaje.startswith("&"): # envio de archivo por TCP
                path = mensaje[1:].strip()
                if not path:
                    print("Error: Debe especificar la ruta del archivo")
                    continue
                if not os.path.isfile(path):
                    print(f"Error: El archivo '{path}' no existe")
                    continue
                    
                try:
                    sckt_tcp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    sckt_tcp.settimeout(5)
                    sckt_tcp.connect((destino, int(puerto+1)))
                    print(f"Se estableció la conexión TCP con {destino}")
                    
                    total_chunks = 0
                    with open(path, "rb") as archivo:
                        while True:
                            chunk = archivo.read(MAX_LARGO_MENSAJE-1)
                            if not chunk:
                                break
                            sckt_tcp.sendall(chunk)
                            total_chunks += 1
                    
                    print(f"Archivo enviado exitosamente ({total_chunks} chunks)")
                    sckt_tcp.close()
                except socket.timeout:
                    print(f"Error: Timeout al conectar con {destino}")
                except ConnectionRefusedError:
                    print(f"Error: Conexión rechazada por {destino}")
                except Exception as e:
                    print(f"Error al enviar archivo: {e}")
            else:
                try:
                    IPAddr = socket.gethostbyname(destino)
                    msg_formateado = f"{IPAddr} {nom} dice: {mensaje}"
                    sckt.sendto(msg_formateado.encode('utf-8'), (destino, int(puerto)))
                    print(f"Mensaje enviado a {destino}")
                except socket.gaierror:
                    print(f"Error: No se pudo resolver la dirección '{destino}'")
                except Exception as e:
                    print(f"Error al enviar mensaje: {e}")
        except EOFError:
            break
        except KeyboardInterrupt:
            break
        
    
def receptor(puerto):
    sv_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) # abrimos socket udp
    sv_socket.bind(('', int(puerto))) # lo bindeamos
    sv_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sv_socket.settimeout(1.0)  # timeout para no bloquear indefinidamente

    while not stop_event.is_set():
        try:
            msg, addr = sv_socket.recvfrom(MAX_LARGO_MENSAJE) # recibimos mensaje, addr es necesario porque el mensaje viene en formato tupla y si se escribe solo msg queda mal
            tiempoLocal = time.localtime() # obtenemos la hora a la que se recibe el msg
            tiempo = time.strftime("[%Y.%m.%d %H:%M:%S]", tiempoLocal) # le damos el formato
            try:
                mensaje_decodificado = msg.decode('utf-8')
                print(f"\n{tiempo} de {addr[0]}:{addr[1]}")
                print(f"  {mensaje_decodificado}\n")
            except UnicodeDecodeError:
                print(f"\n{tiempo} de {addr[0]}:{addr[1]}")
                print(f"  [Mensaje binario recibido - {len(msg)} bytes]\n")
        except socket.timeout:
            continue
        except Exception as e:
            if not stop_event.is_set():
                print(f"Error en receptor UDP: {e}")
            continue
    sv_socket.close()


def receptor_tcp(puerto):
    sv_socket2 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sv_socket2.bind(('', int(puerto+1)))
    sv_socket2.listen(3)
    sv_socket2.settimeout(1.0) 
    sv_socket2.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
    while not stop_event.is_set():
        try:
            client_socket, client_address = sv_socket2.accept()
            print(f"Conexión recibida de {client_address}") #avisamos que se establece la conexión tcp
            
            # Generar nombre único para el archivo recibido
            timestamp = time.strftime("%Y%m%d_%H%M%S")
            nombre_archivo = f'archivo_recibido_{timestamp}'
            
            with open(nombre_archivo, 'wb') as archivo_recibido:
                total_chunks = 0
                while not stop_event.is_set():
                    chunks = client_socket.recv(MAX_LARGO_MENSAJE)
                    if not chunks:
                        break
                    archivo_recibido.write(chunks)
                    total_chunks += 1
                    
                print(f"Transferencia finalizada - {total_chunks} chunks recibidos")
                print(f"Archivo guardado como: {nombre_archivo}")
            client_socket.close()
        except socket.timeout:
            continue
        except Exception as e:
            if not stop_event.is_set():
                print(f"Error en receptor TCP: {e}")
            continue
    sv_socket2.close()


def autenticacion_local(usuarios_file="usuarios.txt"):
    """Autenticación local usando archivo de usuarios como fallback"""
    try:
        nom = input("Ingresar nombre de usuario: ")
        pw = input("Ingresar contraseña: ")
        pw_md5 = hashlib.md5(pw.encode()).hexdigest()
        
        with open(usuarios_file, 'r') as f:
            for linea in f:
                linea = linea.strip()
                if not linea:
                    continue
                partes = linea.split(';')
                if len(partes) >= 2:
                    usuario_hash = partes[0].split('-')
                    if len(usuario_hash) == 2:
                        usuario, hash_esperado = usuario_hash
                        nombre_completo = partes[1]
                        
                        if usuario == nom and hash_esperado == pw_md5:
                            print(f"Bienvenido {nombre_completo}")
                            return (True, nom)
        
        print("Credenciales incorrectas")
        return (False, None)
    except FileNotFoundError:
        print(f"Error: No se encontró el archivo {usuarios_file}")
        return (False, None)
    except Exception as e:
        print(f"Error en la autenticación local: {e}")
        return (False, None)


def autenticacion(ipAuth, portAuth): # función de autenticación de usuarios
    if telnetlib is None:
        print("telnetlib no disponible en esta versión de Python. Usando autenticación local...")
        return autenticacion_local()
    
    bienvenida_esperada = "Redes 2024 - Laboratorio - Autenticacion de Usuarios"
    try:
        tn = telnetlib.Telnet(ipAuth, portAuth)
        bienvenida = tn.read_until(b"\r\n", timeout=5).decode('utf-8')
        
        if bienvenida_esperada not in bienvenida:
            tn.close()
            print("Protocolo incorrecto del servidor remoto")
            print("Intentando autenticación local...")
            return autenticacion_local()

        nom = input("Ingresar nombre de usuario: ")
        pw = input("Ingresar contraseña: ")

        pw_md5 = hashlib.md5(pw.encode()).hexdigest()
        mensaje = nom + "-" + pw_md5 + "\r\n"

        tn.write(mensaje.encode('ascii'))

        respuesta = tn.read_until(b"\r\n", timeout=5).decode('utf-8').strip()
        nom_usr = tn.read_until(b"\r\n", timeout=5).decode('utf-8').strip()

        tn.close()

        if respuesta == "SI":
            print(f"Bienvenido {nom_usr}")
            return (True, nom)
        elif respuesta == "NO":
            print("Credenciales incorrectas en servidor remoto")
            print("Intentando autenticación local...")
            return autenticacion_local()
        else:
            print(f"Respuesta inesperada del servidor: {respuesta}")
            print("Intentando autenticación local...")
            return autenticacion_local()
    except (ConnectionRefusedError, OSError, socket.timeout) as e:
        print(f"Servidor de autenticación no disponible ({e})")
        print("Usando autenticación local...")
        return autenticacion_local()
    except Exception as e:
        print(f"Error en la autenticación remota: {e}")
        print("Intentando autenticación local...")
        return autenticacion_local()
 

def salir(signum, frame): # hacer que finalice todos los procesos
    print("\n\ncontrol + c recibido... cerrando sesión")
    stop_event.set()
    sys.exit(0)



if __name__ == "__main__": 
    if len(sys.argv) < 2:
        print("Uso: python mensajeria.py <puerto> [<ipAuth> <portAuth>]")
        print(" Si no se especifica ipAuth y portAuth, se usa autenticación local")
        sys.exit(1)

    # asignamos los parametros a variables
    puerto = int(sys.argv[1])
    
    signal.signal(signal.SIGINT, salir)

    # Intentar autenticación remota si se proporcionan argumentos, sino usar local
    if len(sys.argv) == 4:
        ipAuth = sys.argv[2] # 200.125.29.234 (host: ti.esi.edu.uy)
        portAuth = int(sys.argv[3]) # 33
        resultado, nom = autenticacion(ipAuth, portAuth)
    else:
        print("Modo autenticación local (sin servidor remoto)")
        resultado, nom = autenticacion_local()

    if not resultado or not nom:
        print("No se pudo autenticar. Saliendo...")
        sys.exit(1)

    procesos = []
    #creamos los hilos
    recibir = threading.Thread(target = receptor, args=(puerto,), daemon=True)
    procesos.append(recibir)
    recibir.start()

    recibir_archivo = threading.Thread(target = receptor_tcp, args=(puerto,), daemon=True)
    procesos.append(recibir_archivo)
    recibir_archivo.start()

    try:
        emisor(puerto, nom)
    except KeyboardInterrupt:
        pass
    finally:
        print("\nCerrando aplicación...")
        stop_event.set()
        time.sleep(0.5)  # tiempo a los hilos para cerrar
        for proceso in procesos:
            proceso.join(timeout=1.0)

    print("Programa terminado.")