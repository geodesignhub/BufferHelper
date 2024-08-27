importScripts('../js/turf.min.js');

function computeBufferSubstract(buffer, diagGJ) {
    let buffer_distance = parseFloat(buffer);
    let diagram_geojson = JSON.parse(diagGJ);
    let features_length = diagram_geojson.features.length;
    let output_feature_collection = { "type": "FeatureCollection", "features": [] };

    for (let x = 0; x < features_length; x++) {
        let current_feature = diagram_geojson['features'][x];
        let current_feature_properties = current_feature.properties;
        let buffered_feature = turf.buffer(current_feature, buffer_distance, { units: 'kilometers' });
        const feature_type = current_feature['geometry']['type'];
        let new_feature = current_feature;
        if (feature_type == 'LineString' || feature_type == 'Point') {
            new_feature = turf.buffer(current_feature, 5, { units: 'meters' });
        }


        let diff = turf.difference(buffered_feature, new_feature);
        diff.properties = current_feature_properties;
        output_feature_collection.features.push(diff);
    }

    self.postMessage({
        'output': JSON.stringify(output_feature_collection)
    });

}

self.onmessage = function (e) {
    computeBufferSubstract(e.data.buffer, e.data.diagGJ);
}