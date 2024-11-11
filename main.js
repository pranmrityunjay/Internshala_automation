let { id, pass } = require("./secret");//Importing Modules and Dependencies
let tab;
let dataFile = require("./data");
const pup = require("puppeteer");

async function main() {
    try {
        let browser = await pup.launch({//Launching Browser
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"],
        });
        let pages = await browser.pages();
        tab = pages[0];
        await tab.goto("https://internshala.com/");////Login through email and password
        await tab.waitForSelector('.login-cta', { timeout: 6000 });
        await tab.click('.login-cta');
        
        await tab.waitForSelector('#login-modal', { visible: true });
        await tab.type("#modal_email", id);
        await tab.type("#modal_password", pass);
        await tab.click("#modal_login_submit");
                                                            
        await tab.waitForNavigation({ waitUntil: "networkidle2" });//Launching Browser and Navigating to the URL
        
        let resumeUrl = "/student/resume?detail_source=resume_direct";
        await tab.goto("https://internshala.com" + resumeUrl);

        await new Promise(resolve => setTimeout(resolve, 5000));

        const data = dataFile[0];
        
        async function clearAndType(selector, value) {//Function to Clear and Type in Input Fields
            try {
                await tab.waitForSelector(selector, { visible: true });
                await tab.click(selector);
                await tab.keyboard.down('Control'); 
                await tab.keyboard.press('A');
                await tab.keyboard.up('Control');
                await tab.keyboard.press('Backspace');
                for (const char of value) {
                    await tab.type(selector, char);
                    await new Promise(resolve => setTimeout(resolve, 2)); 
                }
                await tab.waitForFunction(
                    (selector, expectedLength) => document.querySelector(selector).value.length === 
                    expectedLength,
                    {},
                    selector,
                    value.length
                );
        
                await new Promise(resolve => setTimeout(resolve, 500)); 
            } catch (error) {
                console.error(`Error clearing and typing in ${selector}:`, error);
            }
        }
        
        // Update  CareerObjectives
        try {
            await tab.waitForSelector('#edit-accomplishments', { timeout: 6000 });
            await tab.click('#edit-accomplishments');

            await tab.waitForSelector('#career-objective-modal', { visible: true });

            await clearAndType("#career_objective_description", data.CareerObjective);

            await tab.click("#career-objective-submit");
            console.log("Education details submitted.");
            await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
            console.error("Error updating education details:", error);
        }
        // Update Education details
        try {
            await tab.waitForSelector('#edit-education', { timeout: 6000 });
            await tab.click('#edit-education');

            await tab.waitForSelector('#college-modal', { visible: true });

            await clearAndType("#college", data.College);
            await clearAndType("#degree", data.Degree);
            await clearAndType("#stream", data.Stream);
            await clearAndType("#performance-college", data.Percentage);

            await tab.click("#college-submit");
            console.log("Education details submitted.");
            await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
            console.error("Error updating education details:", error);
        }
        // Update other-description
        try {
            await tab.waitForSelector('#edit-por', { timeout: 12000 });
            await tab.click('#edit-por');

            await tab.waitForSelector('#por-modal', { visible: true });
            await clearAndType("#other_experiences_por_description", data.description);
            await tab.click("#por-submit");
            console.log("Other experiences updated successfully!");
            await new Promise(resolve => setTimeout(resolve, 2000)); 

        } catch (error) {
            console.error("Error updating other experiences:", error);
        }
        // edit projects
        try {
            await tab.waitForSelector('#edit-project', { timeout: 6000 });
            await tab.click('#edit-project');

            await tab.waitForSelector('#project-modal', { visible: true });

            await clearAndType("#other_experiences_title", data.ProjectName);
            await clearAndType("#other_experiences_project_description", data.ProjectName_Description);
            await clearAndType("#other_experiences_project_link", data.link);
        
            await tab.click("#project-submit");
            console.log("Education details submitted.");
            await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
            console.error("Error updating education details:", error);
        }

    await application(data);

    } catch (error) {
        console.error("Error in main function:", error);
    }
}

main()