import sys
import socket
import threading

# Config
HOST = "localhost"
PORT = 4221
FILES_DIR = ""

# HTTP Statuses
HTTP_STATUS_OK = "HTTP/1.1 200 OK\r\n"
HTTP_STATUS_NOT_FOUND = "HTTP/1.1 404 Not Found\r\n"
HTTP_STATUS_CREATED = "HTTP/1.1 201 Created\r\n"


def response(status, headers, body):
    """
    Returns a properly formatted HTTP response.

    Args:
        status (str): The HTTP status code and message.
        headers (dict): A dictionary of HTTP headers.
        body (str): The response body.

    Returns:
        bytes: The encoded HTTP response.
    """
    sts = status.splitlines()[0]
    print(f"DH00080: response.status = {sts}")
    print(f"DH00081: response.headers =")
    for k, v in headers.items():
        print(f"   -> {k}, {v}")
    print(f"DH00082: response.body = {body}")

    return (status +
            "".join(f"{k}: {v}\r\n" for k, v in headers.items()) +
            "\r\n" +
            body + "\r\n").encode()


def handle_request(request, files=None):
    """
    Handle incoming HTTP requests and generate appropriate HTTP responses.

    Args:
        request (list): A list containing the HTTP request data.
        files (str, optional): The path to the directory containing
                               files to be served. Defaults to None.

    Returns:
        response: An HTTP response object containing
        the appropriate status code, headers, and body.
    """
    method, path, _ = request[0].split(" ")

    if method == "GET" and path == "/":
        res = response(
            status=HTTP_STATUS_OK + "\r\n",
            headers={},
            body=""
        )

    elif method == "GET" and path.startswith('/echo'):
        content = path.split("/echo/")[1]
        res = response(
            status=HTTP_STATUS_OK,
            headers={"Content-Type": "text/plain",
                     "Content-Length": len(content)},
            body=content
        )

    elif method == "GET" and path.startswith('/user-agent'):
        content = request[2].split(": ")[1]
        res = response(
            status=HTTP_STATUS_OK,
            headers={"Content-Type": "text/plain",
                     "Content-Length": len(content)},
            body=content
        )

    elif path.startswith('/files'):
        file_name = path.split("/files/")[1]
        if method == "POST":
            content = request[-1]
            handle_files(
                file_name=file_name,
                file_content=content, mode="write")

            res = response(
                status=HTTP_STATUS_CREATED,
                headers={"Content-Type": "text/plain",
                         "Content-Length": len(content)},
                body=content
            )
        else:
            file_content = handle_files(
                file_name=file_name, mode="read")
            if file_content:
                res = response(
                    status=HTTP_STATUS_OK,
                    headers={"Content-Type": "application/octet-stream",
                             "Content-Length": len(file_content)},
                    body=file_content
                )
            else:
                res = response(
                    status=HTTP_STATUS_NOT_FOUND + "\r\n",
                    headers={},
                    body=""
                )

    else:
        res = response(
            status=HTTP_STATUS_NOT_FOUND + "\r\n",
            headers={},
            body=""
        )

    return res


def handle_files(file_name, file_content=None, mode="read"):
    if mode == 'write':
        with open(f"{FILES_DIR}{file_name}", "w", encoding='UTF8') as f:
            file = f.write(file_content)

    else:
        try:
            with open(f"{FILES_DIR}{file_name}", "r") as f:
                file = f.read()
        except FileNotFoundError:
            file = None

    return file


def handle_client(conn, addr):
    """
    Handle incoming client requests.

    Args:
        conn (socket): The client socket connection.
        addr (tuple): The client address.

    Returns:
        bytes: The response to send back to the client.
    """
    request = conn.recv(4096).decode(
        ).splitlines()
    
    conn.send(handle_request(request))
    conn.close()

    # console msg waiting
    print("DH00090: Waiting for client connection...")


def main(args):

    # console msg program title
    print("")
    print("  >>> DGD HTTP Server Python <<<")
    print("")

    # console msg server start
    print("DH00010: Server Start")
    

    # bind to cont PORT (4221)
    server_socket = socket.create_server((HOST, PORT), reuse_port=True)
    
    # console msg listening port
    print("DH00020: Server is running on port {PORT}")

    if args:
        global FILES_DIR
        FILES_DIR = args[1]

    try:
        while True:

            # console msg waiting
            print("DH00030: Waiting for client connection...")

            conn, addr = server_socket.accept() # wait for client

            thread = threading.Thread(target=handle_client, args=(conn, addr))

            print("DH00040: Connection established")
            print(f"   -> conn: {conn}")
            print(f"   -> addr: {addr}")
            print(f"   -> thread: {thread}")

            thread.start()
    except KeyboardInterrupt:
        print("\nDH00050: Server is shutting down.")
    finally:
        # clean up the server socket
        server_socket.close()
        print("DH00060: Server has been shut down.")



if __name__ == "__main__":
    main(sys.argv[1:])
