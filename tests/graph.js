import { createCanvas } from '@napi-rs/canvas';
import fs from 'fs';
import { Chart } from 'chart.js/auto';

/**
 * Reads the data file and processes statistical test results.
 * Generates line graphs for KS Statistic, Chi-Square Statistic, Runs Test Statistic over time.
 */
async function generateStatGraphs() {
    const filePath = './results/data.json';
    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);

    // Prepare datasets
    let logFiles = Object.keys(data); // Log filenames as x-axis labels
    let datasets = {
        "KS Statistic": { Weak: [], Pseudo: [], True: [], Quantum: [] },
        "Chi-Square Statistic": { Weak: [], Pseudo: [], True: [], Quantum: [] },
        "Runs Test Statistic": { Weak: [], Pseudo: [], True: [], Quantum: [] },
        "KS P-Value": { Weak: [], Pseudo: [], True: [], Quantum: [] },
        "Chi-Square P-Value": { Weak: [], Pseudo: [], True: [], Quantum: [] },
        "Runs Test P-Value": { Weak: [], Pseudo: [], True: [], Quantum: [] }
    };

    // Parse the JSON file and populate datasets
    logFiles.forEach((logFile, index) => {
        let [ksResults, chiResults, runsResults] = data[logFile];

        ["Weak", "Pseudo", "True", "Quantum"].forEach((generator, i) => {
            datasets["KS Statistic"][generator].push(ksResults[i][0] ?? 0);
            datasets["KS P-Value"][generator].push(ksResults[i][1] ?? 0);

            datasets["Chi-Square Statistic"][generator].push(chiResults[i][0] ?? 0);
            datasets["Chi-Square P-Value"][generator].push(chiResults[i][1] ?? 0);

            datasets["Runs Test Statistic"][generator].push(runsResults[i]["statistic"] ?? 0);
            datasets["Runs Test P-Value"][generator].push(runsResults[i]["pValue"] ?? 0);
        });
    });

    // Generate charts for each statistical test
    await Promise.all([
        generateChart(logFiles, datasets["KS Statistic"], "KS Statistic Over Logs", "ks_statistic.png"),
        generateChart(logFiles, datasets["Chi-Square Statistic"], "Chi-Square Statistic Over Logs", "chi_square_statistic.png"),
        generateChart(logFiles, datasets["Runs Test Statistic"], "Runs Test Z-Statistic Over Logs", "runs_statistic.png"),
        generateChart(logFiles, datasets["KS P-Value"], "KS P-Value Over Logs", "ks_pvalue.png"),
        generateChart(logFiles, datasets["Chi-Square P-Value"], "Chi-Square P-Value Over Logs", "chi_square_pvalue.png"),
        generateChart(logFiles, datasets["Runs Test P-Value"], "Runs Test P-Value Over Logs", "runs_pvalue.png"),
    ]);

    console.log("✅ All graphs generated successfully with logs as x-axis labels!");
}

/**
 * Creates a line chart and saves it as a PNG file.
 */
async function generateChart(labels, datasetValues, title, filename) {
    const width = 1200, height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const datasets = Object.entries(datasetValues).map(([generator, values], index) => ({
        label: generator,
        data: values,
        borderColor: ['red', 'blue', 'green', 'purple'][index],
        borderWidth: 2,
        fill: false,
        tension: 0.2
    }));

    const chartConfig = {
        type: 'line',
        data: {
            labels: labels.map(String),  // Ensure logs are strings
            datasets: datasets
        },
        options: {
            scales: {
                x: { 
                    title: { display: true, text: "Log File (Time Progression)" },
                    ticks: {
                        autoSkip: true, // Prevents label clutter
                        maxTicksLimit: 15, // Limits the number of x labels
                    }
                },
                y: { title: { display: true, text: title } }
            },
            plugins: {
                title: { display: true, text: title }
            }
        }
    };

    new Chart(ctx, chartConfig);
    fs.writeFileSync(`./images/${filename}`, canvas.toBuffer('image/png'));
    console.log(`📊 Saved ${filename}`);
}

// Run the script
generateStatGraphs();