// js/tf-model.js
class PlagueDetectionModel {
    constructor() {
        this.model = null;
        this.labels = [];
        this.isModelLoaded = false;
    }

    async loadModel() {
        try {
            console.log('Cargando modelo de TensorFlow.js...');
            
            // Cargar el modelo
            this.model = await tf.loadLayersModel('assets/models/model.json');
            
            // Cargar las etiquetas
            const response = await fetch('assets/models/labels.txt');
            const labelsText = await response.text();
            this.labels = labelsText.split('\n').map(label => {
                // Formato: "0: Nombre de la plaga"
                return label.includes(':') ? label.split(':')[1].trim() : label.trim();
            }).filter(label => label !== '');
            
            this.isModelLoaded = true;
            console.log('Modelo cargado correctamente');
            console.log('Etiquetas:', this.labels);
            
            return true;
        } catch (error) {
            console.error('Error cargando el modelo:', error);
            this.isModelLoaded = false;
            return false;
        }
    }

    async predict(imageElement) {
        if (!this.isModelLoaded) {
            throw new Error('Modelo no cargado. Llama a loadModel() primero.');
        }

        // Preprocesamiento de la imagen
        const tensor = tf.browser.fromPixels(imageElement)
            .resizeNearestNeighbor([224, 224])  // Tamaño esperado por el modelo
            .toFloat()
            .div(tf.scalar(255.0))  // Normalizar a [0, 1]
            .expandDims(0);

        // Realizar predicción
        const predictions = await this.model.predict(tensor).data();
        
        // Liberar memoria del tensor
        tensor.dispose();

        // Procesar resultados
        const results = [];
        for (let i = 0; i < predictions.length; i++) {
            if (predictions[i] > 0.1) {  // Umbral mínimo de confianza
                results.push({
                    label: this.labels[i] || `Plaga ${i}`,
                    confidence: Math.round(predictions[i] * 100)
                });
            }
        }

        // Ordenar por confianza (mayor a menor)
        results.sort((a, b) => b.confidence - a.confidence);

        return results.slice(0, 3);  // Devolver top 3 resultados
    }

    async predictFromImageData(imageData) {
        // Crear un elemento de imagen temporal
        const img = new Image();
        return new Promise((resolve, reject) => {
            img.onload = async () => {
                try {
                    const results = await this.predict(img);
                    resolve(results);
                } catch (error) {
                    reject(error);
                }
            };
            img.onerror = reject;
            img.src = imageData;
        });
    }

    dispose() {
        if (this.model) {
            this.model.dispose();
        }
    }
}

// Crear una instancia global del modelo
window.plagueDetectionModel = new PlagueDetectionModel();