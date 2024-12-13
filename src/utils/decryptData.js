export const decrypt = async (encryptedData, ivBase64) => {
    try {
        const algorithm = {
            name: "AES-CBC",
            iv: Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0)), // Decodifica IV desde Base64
        };

        // Clave de encriptación
        const keyBase64 = process.env.REACT_APP_ENCRYPTION_KEY;
        const keyData = Uint8Array.from(atob(keyBase64), (c) => c.charCodeAt(0)); // Decodifica la clave desde Base64

        // Importa la clave en el formato de SubtleCrypto
        const cryptoKey = await window.crypto.subtle.importKey(
            "raw", // Clave sin formato
            keyData,
            algorithm.name,
            false, // Clave no exportable
            ["decrypt"] // Permisos para desencriptar
        );

        // Decodifica los datos cifrados desde Base64
        const encryptedBuffer = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));

        // Desencripta los datos
        const decryptedBuffer = await window.crypto.subtle.decrypt(algorithm, cryptoKey, encryptedBuffer);

        // Convierte el resultado a texto
        const decoder = new TextDecoder();
        return decoder.decode(decryptedBuffer);
    } catch (error) {
        console.error("Error al desencriptar los datos:", error);
        throw new Error("Error al desencriptar los datos");
    }
};
