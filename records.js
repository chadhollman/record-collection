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

    // Distribution Chart for Top 25 Artists in Collection
    updateArtistDistribution(data);
});

// Function to update charts based on selected artist
const pallette = ["#253D93", "#8390FA", "#FAC748", "#F78DAD", "#F9E9EC", "D2F1E4", "FF5964", "645E9D", "EFABFF", "B1E7B9", "78C3E3", "344966", 
                   "E6AACE", "F0F4EF", "BFCC94", "FFD275", "E8AE68", "A57F60", "E3A587", "DB5A42", "35A7FF", "F19953", "A167A5", "E66070", "00D9C0"];
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
    hoverinfo: 'y',
    marker: { color: pallette, size: 25 }
}];
const scatterLayout = {
    width: 1295,
    height: 700,
    paper_bgcolor: 'rgba(0,0,0,0)', 
    plot_bgcolor: 'rgba(0,0,0,0)', 
    margin: {
        b: 150,
        t: 50,
        l: 100,
        r: 100
    },
    xaxis: {
        color: 'white',
        automargin: true
    },
    yaxis: { 
        title: {
            text: "Release Year",
            standoff: 20
        },
        color: 'white',
        tickformat: 'd',
        gridcolor: 'rgba(255, 255, 255, 0.2)',
        tickfont: { color: 'white' },
    }
};
Plotly.newPlot("bar", scatterData, scatterLayout);
}

function updateArtistDistribution(data) {
    // Calculate frequency of each artist in the collection and sort by count
    const artistCounts = d3.rollups(data, v => v.length, d => d.Artist)
        .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
        .slice(0, 25); // Take the top 25 artists

    // Separate artist names and counts for top 25
    const artistNames = artistCounts.map(d => d[0]);
    const counts = artistCounts.map(d => d[1]);

    // Create doughnut chart
    const distributionData = [{
        labels: artistNames,
        values: counts,
        type: "pie",
        hole: 0.4,
        marker: {
            colors: pallette,
            line: {
                color: 'white',
                width: 3 
            }
        },
        textinfo: "label",
        hoverinfo: "value",
        textposition: "inside",
        options: {
            plugins: {
                legend: {
                    display: false,
                },
            }
        }
    }];
    const distributionLayout = {
        width: 1295,
        height: 900,
        paper_bgcolor: 'rgba(0,0,0,0)', 
        plot_bgcolor: 'rgba(0,0,0,0)', 
        showlegend: false,
        hoverlabel: {
            font: {
                size: 25
            }
        },
        margin: {
            l: 50,
            r: 50,
            t: 50,
            b: 50  
        },
    };
    Plotly.newPlot("distribution", distributionData, distributionLayout);
};