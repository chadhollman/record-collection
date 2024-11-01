// Load the JSON data and create the dropdown
d3.json("recordcollection.json").then(data => {
    const uniqueArtists = [...new Set(data.map(d => d.Artist))].sort();

    // Populate the dropdown with unique sorted artist names
    const dropdown = d3.select("#artistDropdown");
    uniqueArtists.forEach(artist => {
        dropdown.append("option")
            .text(artist)
            .property("value", artist);
    });

    // Initialize with the first artist's data
    const initialArtist = uniqueArtists[0];
    updateCharts(initialArtist, data);

    // Update charts when a new artist is selected
    dropdown.on("change", function() {
        const selectedArtist = dropdown.property("value");
        updateCharts(selectedArtist, data);
    });

    // Distribution Chart for Top 10 Artists in Collection
    updateArtistDistribution(data);
});

// Function to update charts based on selected artist
function updateCharts(artist, data) {
    const artistRecords = data
        .filter(d => d.Artist === artist)
        .sort((a, b) => a.Released - b.Released);

    // Update the header with the selected artist's name
    document.getElementById("artistName").innerText = `${artist}`;

    // Create Scatter Plot for Record Titles by Year
    const titles = artistRecords.map(d => d.Title);
    const releaseYears = artistRecords.map(d => d.Released);
    const scatterData = [{
        x: titles,
        y: releaseYears,
        mode: "markers",
        marker: { color: "teal", size: 15 }
    }];
    const scatterLayout = {
        
        margin: {
            b: 150,
            t: 50,
            l: 50,
            r: 50 
          },
        yaxis: { 
            title: "Release Year",
            tickformat: 'd'  // Display y-axis values as integers
        }
    };
    Plotly.newPlot("bar", scatterData, scatterLayout);
}

// Function to create distribution chart for top 20 artist appearances
function updateArtistDistribution(data) {
    // Calculate frequency of each artist in the collection and sort by count
    const artistCounts = d3.rollups(data, v => v.length, d => d.Artist)
        .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
        .slice(0, 10); // Take the top 20 artists

    // Separate artist names and counts for top 20
    const artistNames = artistCounts.map(d => d[0]);
    const counts = artistCounts.map(d => d[1]);

    // Create pie chart
    const distributionData = [{
        labels: artistNames,
        values: counts,
        type: "pie",
        marker: { colors: d3.schemeCategory10 } // Use a color scheme for better distinction
    }];
    const distributionLayout = {
        
    };
    Plotly.newPlot("distribution", distributionData, distributionLayout);
};