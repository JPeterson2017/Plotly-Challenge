function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {    
    // 3. Create a variable that holds the samples array. 
      var samplesData = data.samples

    // 4. Create a variable that filters the samples for the object with the desired sample number.
     // var filteredSamples = metadata.filter(sampleObj => sampleObj.id == sample);
      var sampleArray = samplesData.filter(selectedObj => selectedObj.id == sample);

     //  5. Create a variable that holds the first sample in the array.
    //  var firstSample = filteredSamples[0]
      var sorted_samples = sampleArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    
      var sampleIds = sorted_samples.otu_ids;
      console.log(sampleIds);

      var sampleLabels = sorted_samples.otu_labels;
      console.log(sampleLabels);
     
      var sampleValues = sorted_samples.sample_values;
      console.log(sampleValues);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
      var yticks = sampleIds.slice(0,10).reverse().map(function(element) {
        return `OTU: ${element}`});
      console.log(yticks)
      var xticks = sampleValues.slice(0,10).reverse();
      console.log(xticks)
      var labels = sampleLabels.slice(0,10).reverse();
      console.log(labels)
    
    // 8. Create the trace for the bar chart. 
      var trace = {
        x: xticks,
        y: yticks,
        type: "bar",
        orientation: "h",
        text: labels 
      }; 
      var barData = [trace]
    // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: "Top 10 Bacterias Found",
      };

    // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);    
 

// DELIVERABLE 2 - BUBBLE CHART
 // 1. Create the trace for the bubble chart.
      var xbub = sampleIds;
      xbub.push.apply(xbub, sampleIds.slice(Math.max(sampleIds.length - 10, 1)));

      var ybub = sampleValues;
      ybub.push.apply(ybub, sampleValues.slice(Math.max(sampleValues.length - 10, 1)));

      var labelsbub = sampleLabels;
      labelsbub.push.apply(labelsbub, sampleLabels.slice(Math.max(sampleLabels.length - 10, 1)));
  
      console.log(xbub);
      console.log(ybub);
      console.log(labelsbub); 
 
      var trace1 = {
      x: xbub,
      y: ybub,
      mode: 'markers',
      marker: {
        color: xbub,
        size: ybub,
        colorscale: "Earth"
      },
      text: labelsbub
   
      };
 
      var data = [trace1];

// 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: 'Bacteria Cultures Per Sample',
        xaxis: {
          title: "OTU ID"
      },
        showlegend: false,
        height: 600,
        width: 1150
     };


// 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot('bubble', data, bubbleLayout); 


// DELIVERABLE 3 - WASH FREQ GAUGE
// 1. Create a variable that filters the metadata array for the object with the desired sample number.
      var metadata = data.metadata
    //  var metaArray = metadata[[id],[wfreq]];
      var filteredWash = metadata.filter(metaObj => metaObj.id == sample);
      
    // 2. Create a variable that holds the first sample in the metadata array.
      var washArray = filteredWash[0]

    // 3. Create a variable that holds the washing frequency.
      var washFreq = washArray.wfreq;   

    // 4. Create the trace for the gauge chart.
      var gaugeData = [
        {
          title: { text: "Belly Button Washing Fequency <br> Scrubs per Week"},
          type: "indicator",
          mode: "gauge+number",
          value: washFreq,
          gauge: {
            axis: { range: [0, 10], ticks: 4},
            steps: [
              { range: [0, 2], color: "red" },
              { range: [2, 4], color: "orange" },
              { range: [4, 6], color: "yellow" },
              { range: [6, 8], color: "lightgreen" },
              { range: [8, 10], color: "green" },
            ],
            threshold: {
              line: { color: "black", wide: 3},
              thickness: 0.75,
              value: washFreq
          }
        }
      }   
    ];
    
    // 5. Create the layout for the gauge chart.
        var gaugeLayout = { width: 600, height: 450, margin: {t: 0, b: 0 }     
    };

    // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
