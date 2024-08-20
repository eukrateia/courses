import socket

# Handles an incoming HTTP request by sending a 200 OK response
def handle_request(client_socket):

    # read data from the client
    client_socket.recv(1024) # reading data

    # send a 200 OK reponse
    response = "HTTP/1.1 200 OK\r\n\r\n"
    client_socket.send(response.encode())

def main():

    # You can use print statements as follows for debugging, they'll be 
    #   visible when running tests.
    log_x = 1
    print(f"{log_x} Log_10: *** Begin main() ***")

    host_ip_listen = "localhost"
    host_port_listen = 4221

    # create a TCP/IP socket and bind to port 4221
    server_socket = socket.create_server(
            (host_ip_listen, host_port_listen), 
            reuse_port=True
        )
    log_x += 1
    print(f"{log_x} Log_20: Server is running on port {host_port_listen}")

    try:
        while True:
            # wait for a connection
            log_x += 1
            print(f"{log_x} Log_30: Waiting for a connection...")
            client_socket, addr = server_socket.accept()

            log_x += 1
            print(f"{log_x} Log_40: Connection from {addr} has been established")

            # handle the client request
            handle_request(client_socket)

            # close the connection to the client
            client_socket.close()
    except KeyboardInterrupt:
        log_x += 1
        print(f"\n{log_x} Log_50: Server is shutting down.")
    finally:
        # clean up the server socket
        server_socket.close()
        log_x += 1
        print(f"{log_x} Log_60: Server has been shut down.")

if __name__ == "__main__":
    main()
