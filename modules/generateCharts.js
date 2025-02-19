import { createCanvas } from '@napi-rs/canvas';
import fs from 'fs';
import { Chart } from 'chart.js/auto';

function saveFile(filename, data) {
    fs.writeFileSync(`images/${filename}`, data);
}

/**
 * Generates multiple charts for analyzing RNG performance.
 * @param {Array} rankingData - Processed data with average p-values and statistics.
 * @param {Object} distributions - Raw number distributions for histogram.
 */
export async function generateRNGCharts(rankingData, distributions) {
    const width = 800, height = 600;

    // 🎯 Extract Data from Ranking
    const labels = rankingData.map(item => item[2]); // Generator Names
    const pValues = rankingData.map(item => item[0]); // Average p-values
    const chiStats = rankingData.map(item => item[1]); // Chi-Square Statistics

    // 📊 1. Ranking Chart (Final Summary)
    await generateChart(
        labels,
        [pValues, chiStats],
        ["Average P-Value", "Chi-Square Statistic"],
        "Ranking Summary",
        "ranking_chart.png"
    );

    // 📈 2. Histogram (Number Distribution Per RNG)
    for (const [generator, numbers] of Object.entries(distributions)) {
        await generateHistogram(numbers, generator);
    }

    // 📊 3. P-Value Distribution Chart
    await generateChart(
        labels,
        [pValues],
        ["P-Value"],
        "P-Value Distribution",
        "pvalue_distribution.png"
    );

    // 📈 4. Chi-Square Statistic Distribution
    await generateChart(
        labels,
        [chiStats],
        ["Chi-Square Statistic"],
        "Chi-Square Distribution",
        "chi_square_distribution.png"
    );

    await generateLineGraph(distributions);
    await generateBoxplot(distributions);
    await generateQQPlot(distributions);
    
    console.log("✅ Charts generated successfully!");
}

/**
 * Helper function to create a bar chart.
 */
async function generateChart(labels, datasets, datasetLabels, title, filename) {
    const width = 800, height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const dataSetsConfig = datasets.map((data, index) => ({
        label: datasetLabels[index],
        data: data,
        backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)'][index] // Different colors
    }));

    const chartConfig = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: dataSetsConfig
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            }
        }
    };

    new Chart(ctx, chartConfig);
    saveFile(filename, canvas.toBuffer('image/png'));
    console.log(`📊 Saved ${filename}`);
}

/**
 * Generates a line graph showing the sequence of generated numbers over time.
 * @param {Object} distributions - Object containing number sequences for each RNG.
 */
async function generateLineGraph(distributions) {
    const width = 1000, height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Generate x-axis labels (1, 2, 3, ... for each number generated)
    const labels = Array.from({ length: Math.max(...Object.values(distributions).map(d => d.length)) }, (_, i) => i + 1).toString();

    // Prepare datasets correctly
    const datasets = Object.entries(distributions).map(([generator, values], index) => ({
        label: generator,
        data: values.slice(0, labels.length),  // Match x-axis length
        borderColor: ['red', 'blue', 'green', 'purple'][index],
        borderWidth: 2,
        fill: false,
        tension: 0.1
    }));

    const chartConfig = {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            scales: {
                x: { title: { display: true, text: "Time Step" } },
                y: { title: { display: true, text: "Generated Value" } }
            },
            plugins: {
                title: { display: true, text: "RNG Number Trends Over Time" }
            }
        }
    };

    new Chart(ctx, chartConfig);
    saveFile('line_graph_rng.png', canvas.toBuffer('image/png'));
    console.log("📈 Saved 'line_graph_rng.png'");
}

/**
 * Generates a scatter-based boxplot showing the distribution of RNG outputs.
 * @param {Object} distributions - Object containing number sequences for each RNG.
 */
export async function generateBoxplot(distributions) {
    const width = 800, height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    function getBoxplotValues(values) {
        values.sort((a, b) => a - b);
        const q1 = values[Math.floor(values.length * 0.25)];
        const median = values[Math.floor(values.length * 0.5)];
        const q3 = values[Math.floor(values.length * 0.75)];
        const min = values[0];
        const max = values[values.length - 1];

        return { min, q1, median, q3, max };
    }

    const datasets = Object.entries(distributions).map(([generator, values], index) => {
        const { min, q1, median, q3, max } = getBoxplotValues(values);

        return {
            label: generator,
            data: [
                { x: index, y: min },    // Min
                { x: index, y: q1 },     // Q1
                { x: index, y: median }, // Median
                { x: index, y: q3 },     // Q3
                { x: index, y: max }     // Max
            ],
            borderColor: ['red', 'blue', 'green', 'purple'][index],
            backgroundColor: 'transparent',
            showLine: false,
            pointRadius: 5
        };
    });

    const chartConfig = {
        type: 'scatter',
        data: { datasets: datasets },
        options: {
            scales: {
                x: {
                    title: { display: true, text: "RNG Generators" },
                    ticks: { callback: (val, i) => String(Object.keys(distributions)[i]) }
                },
                y: { title: { display: true, text: "Generated Value" } }
            },
            plugins: {
                title: { display: true, text: "Boxplot (Scatter Representation) for RNG Outputs" }
            }
        }
    };

    new Chart(ctx, chartConfig);
    saveFile('boxplot_rng.png', canvas.toBuffer('image/png'));
    console.log("📊 Saved 'boxplot_rng.png'");
}

/**
 * Generates a QQ-plot comparing RNG outputs to a uniform distribution.
 * @param {Object} distributions - Object containing number sequences for each RNG.
 */
async function generateQQPlot(distributions) {
    const width = 800, height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Sort the observed values for each generator
    const datasets = Object.keys(distributions).map((generator, index) => {
        let sortedValues = [...distributions[generator]].sort((a, b) => a - b);
        let quantiles = sortedValues.map((_, i) => (i + 1) / (sortedValues.length + 1));

        return {
            label: generator,
            data: sortedValues.map((value, i) => ({ x: quantiles[i], y: value })),
            borderColor: ['red', 'blue', 'green', 'purple'][index],
            backgroundColor: 'transparent',
            showLine: false,
            pointRadius: 3
        };
    });

    const chartConfig = {
        type: 'scatter',
        data: { datasets: datasets },
        options: {
            scales: {
                x: { title: { display: true, text: "Theoretical Uniform Quantiles" }, min: 0, max: 1 },
                y: { title: { display: true, text: "Observed Values" } }
            },
            plugins: {
                title: { display: true, text: "QQ-Plot: RNG vs. Uniform Distribution" }
            }
        }
    };

    new Chart(ctx, chartConfig);
    saveFile('qqplot_rng.png', canvas.toBuffer('image/png'));
    console.log("📉 Saved 'qqplot_rng.png'");
}

/**
 * Generates a histogram of number distributions per RNG.
 */
async function generateHistogram(numbers, generatorName) {
    const width = 800, height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const bins = 10;
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const binSize = (max - min) / bins;
    const histogramData = new Array(bins).fill(0);

    numbers.forEach(num => {
        const binIndex = Math.floor((num - min) / binSize);
        histogramData[Math.min(binIndex, bins - 1)]++; // Ensure it doesn't overflow
    });

    const chartConfig = {
        type: 'bar',
        data: {
            labels: Array.from({ length: bins }, (_, i) => `${min + i * binSize}-${min + (i + 1) * binSize}`),
            datasets: [{
                label: `Number Distribution (${generatorName})`,
                data: histogramData,
                backgroundColor: 'rgba(54, 162, 235, 0.7)'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `Number Distribution for ${generatorName}`
                }
            }
        }
    };

    new Chart(ctx, chartConfig);
    saveFile(`histogram_${generatorName}.png`, canvas.toBuffer('image/png'));
    console.log(`📊 Saved histogram_${generatorName}.png`);
}
