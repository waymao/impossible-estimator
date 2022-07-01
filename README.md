# ESG Fund analysis, Front end.

### Installing and Running
Firstly, make sure `node.js` is installed.

Make sure yarnpkg is installed in the system by running `npm install -g yarn`.

Now, install the dependencies by running `yarn install`

Once that's done, you can run the server by running `yarn start`. A development
server will start running and will be listening at `localhost:3000`.
A browser window will normally automatically pop up in your system.

To export a production-ready version of the code, run yarn build. the build,
which is static HTML files,
is ready to be hosted by a web server like nginx.


### Usage

0. (Optional) Metric Customization: If needed, click the Edit Metric/Category button and adjust the desired Categories, Metric and Submetrics.

1. Upload: Drag and Drop files into the upload window. Click Continue.

2. Extraction: Run 'Auto-Validate' on all the files that the user wants to extract information, then click Validate on the pdf.

3. Validation: The Tree View has conveniently grouped all the transformed data points to their respective Categories, Metrics, and Submetrics, and expanding them will allow the user to view all the potential datapoints. 
   - The pencil icon allows editing of the correct categorization of the datapoint
   - The magnifying glass allows the page to jump to the highlighted datapoint
   - The checkmark allows the user to mark this datapoint as Validated
   
   The Processed Data tab has the entire list of transformed data points for the specific page of the pdf that have been associated by the algorithm with keywords defined in the metrics list. Scrolling through the pages of the pdf gives the list of Processed Data for each page.
   - The magnifying glass allows the pdf viewer to jump to the specific datapoint
   - The pencil icon transforms the pdf to edit view, where the black highlight is the keyword, the red highlight is the statistic, and all the other blue highlights are clickable statistics that the user can click to replace the statistic associated with that specific datapoint in case the algorithm detected the wrong number. Alternatively, the user can also manually type in a number in case the algorithm did not detect the number for whatever reason. 
   
   The Raw Data tab has the entire list of raw data points for the specific page of the pdf, split between potential keywords and numbers. This is a reference list in case the user wants to debug the algorithm.

   Once the user is satisfied with the datapoints, they can then click the 'Download' button on the top of the page. If multiple files were uploaded, they can click the 'Files' button to return to the files list and pick another file to analyze.

4. Download: In the files list, click 'Download' on the file that has been properly analyzed. Note that if a file does not have any datapoints Validated, the resulting csv will be empty. A file will be automatically downloaded to the local device.
