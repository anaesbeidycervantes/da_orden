document.addEventListener('DOMContentLoaded', function() {
    const speechResult = document.getElementById('speechResult');
    let recognition = null; // Variable para almacenar el objeto de reconocimiento de voz

    // Función para iniciar el reconocimiento de voz
    function iniciarReconocimiento() {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
        recognition.lang = 'es-ES';
        recognition.continuous = true;

        recognition.onstart = function() {
            console.log('Reconocimiento iniciado');
        }

        recognition.onresult = function(event) {
            let transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
            speechResult.innerHTML = "<strong>Usuario:</strong> " + transcript;

            // Evaluar la orden recibida y ejecutar la acción correspondiente
            ejecutarOrden(transcript);
        }

        recognition.onerror = function(event) {
            console.error('Error en el reconocimiento: ' + event.error);
        }

        // Reiniciar el reconocimiento después de 5 segundos
        setTimeout(function() {
            recognition.stop();
            iniciarReconocimiento();
        }, 5000);

        recognition.start();
    }

    // Función para ejecutar una orden específica
    function ejecutarOrden(orden) {
        switch (orden) {
            case 'abrir google':
            case 'abrir netflix':
            case 'buscar color morado':
            case 'buscar tec de pachuca':
                enviarOrdenServidor(orden);
                break;
            default:
                console.log('Orden no reconocida.');
        }
    }

    // Función para enviar la orden al servidor
    function enviarOrdenServidor(orden) {
        const fechaHora = new Date().toLocaleString(); // Obtiene la fecha y hora actuales en el formato local

        // Datos a enviar al MockAPI
        const datos = {
            orden: orden,
            fechaHora: fechaHora
        };

        // Opciones de la solicitud
        const opciones = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        };

        // URL del MockAPI
        const urlMockAPI = 'https://6639b9141ae792804bec926c.mockapi.io/registros';

        // Enviar la solicitud POST
        fetch(urlMockAPI, opciones)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud POST a MockAPI');
                }
                return response.json();
            })
            .then(data => {
                console.log('Registro exitoso en MockAPI:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Iniciar el reconocimiento de voz al cargar la página
    iniciarReconocimiento();
});
