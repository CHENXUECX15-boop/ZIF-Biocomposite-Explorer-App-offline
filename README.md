# The Offline Version of ZIF Biocomposite Explorer App

## User Guidelines for the Offline Version of ZIF Biocomposite Explorer App

The offline version of ZIF Biocomposite Explorer App is an interactive platform designed for the visualization and exploration of high-throughput ZIF biocomposite datasets. The application enables users to investigate compositional, structural, and performance-related data through layered ternary diagrams and integrated characterization results. Figures and datasets can be exported for further analysis and reporting.

### Getting Started

The offline version of ZIF Biocomposite Explorer App operates as a standalone web application and does not require installation. After extracting the provided ZIP archive, launch the application by opening the corresponding HTML file in a web browser.

### Interface Overview

The interface consists of four main sections:

- **Navigation Bar (top):** Displays the application title, institutional logos, and export functions. The **Download Page PNG** button exports the entire current interface as a high-resolution image.
- **Control Panel (left):** Provides options for dataset selection, visualization settings, and data filtering.
- **Diagram Display Panel (center):** Displays layered ternary diagrams corresponding to different total precursor concentrations.
- **Results Presentation Panel (right):** Shows detailed information and characterization data for the selected sample.

Users can search for sample positions and select the dataset (TD-H<sub>2</sub>O or TD-EtOH), total precursor concentration (all concentrations or a specific concentration), and visualization mode. Samples can be visualized according to crystal phase, EE%, LC%, IR ratio, or amorphous fraction.

### Data Exploration and Visualization

The control panel allows users to filter samples according to formulation parameters (M, L, and BSA) and characterization metrics. The **Reset Filters** button restores the default settings.

In **Phase** mode, samples are color-coded according to their assigned phase (amorphous, **ZIF-C**, **sod**, **dia**, **U13**, **U12**, or mixed). Mixed-phase samples are represented by segmented colors indicating the relative proportion of each phase. In EE%, LC%, IR ratio, amorphous fraction, and framework ratio modes, samples are colored according to the corresponding numerical values.

The toolbar above the ternary diagrams provides additional display controls. Users can show or hide sample numbers, concentration labels, axis labels, and axis values, and adjust their display size. The **Rotate** and **Pan** functions control mouse interaction, while the **Layer Spacing** slider adjusts the separation between ternary-diagram layers.

Predefined viewing directions can be accessed using the **X**, **Y**, **Z**, and **L** buttons. Zooming can be performed using the mouse wheel or the **+** and **-** controls. Each TD layer represents a specific total precursor concentration and contains 36 samples. Selecting a sample displays its detailed information in the Results Presentation Panel. Double-clicking an empty region of the diagram clears the current selection.

### Results Presentation and Data Export

The Results Presentation Panel displays the phase composition, formulation parameters, EE%, LC%, IR-ratio, amorphous fraction, and framework ratio of the selected sample. For mixed-phase samples, the average phase distribution obtained from triplicate syntheses is reported.

A summary table compares the same sample across different total precursor concentrations, facilitating the evaluation of concentration-dependent trends. PXRD patterns and ATR-IR spectra associated with the selected sample are displayed in the lower section of the panel.

Figures can be exported in PNG format using the corresponding download buttons. Normalized PXRD and ATR-IR datasets can be downloaded as CSV files for further analysis. The **Reset** function restores the default spectral view, while the **+** and **-** controls allow zooming of the displayed spectra.


## Development of the Offline ZIF Biocomposite Explorer App

The offline ZIF Biocomposite Explorer App was developed as an interactive web-based platform for the visualization and exploration of ZIF biocomposite datasets. All phase assignments, EE%, LC%, IR ratios, amorphous fractions, framework ratio, PXRD patterns, and ATR-IR spectra displayed in the application originate from experimentally acquired data. Raw experimental results were curated, processed, and organized using Microsoft Excel and Origin, and were stored as Excel spreadsheets and TXT files.

Phase assignment was performed using the ZIF Phase Analysis platform developed at Graz University of Technology (https://rapps.tugraz.at/apps/porousbiotech/ZIFphaseanalysis/). The processed experimental data were subsequently consolidated into structured Excel datasets and converted into JavaScript data files (`data/*.js`), which serve as the data source for the interactive ternary diagrams and sample information panels implemented in the web application.

The application incorporates the open-source JavaScript library html2canvas v1.4.1 (`vendor/html2canvas.min.js`) for page-level PNG export. This library is distributed under the MIT License, and additional packages present in the local dependency tree are transitive dependencies of html2canvas that support text layout, Unicode segmentation, and binary encoding utilities.

### Open-Source Software Used

Open-source software actually used in the offline ZIF biocomposite explorer.

| Project | Version | License | Role in this work | Notes |
| --- | --- | --- | --- | --- |
| html2canvas | 1.4.1 | MIT | Runtime page-to-canvas rendering for full-page PNG export | Bundled locally as `vendor/html2canvas.min.js`. Used for the **Download Page PNG** function. |
| css-line-break | 2.1.0 | MIT | Transitive dependency of html2canvas | Supports CSS/text line breaking behavior during DOM rendering. |
| text-segmentation | 1.0.3 | MIT | Transitive dependency of html2canvas | Supports Unicode grapheme segmentation during text rendering. |
| Utrie | 1.0.2 | MIT | Transitive dependency | Provides Unicode trie data structures used by text segmentation and line-breaking utilities. |
| base64-arraybuffer | 1.0.2 | MIT | Transitive dependency | Provides base64 encoding and decoding utilities for ArrayBuffer data. |
