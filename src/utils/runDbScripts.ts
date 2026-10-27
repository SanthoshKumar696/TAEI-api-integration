import fs from "fs";
import path from "path";
import { sequelize } from "../config/db";

let totalScripts = 0;
let successScripts = 0;
let failedScripts = 0;
let totalStatements = 0;
let successStatements = 0;
let failedStatements = 0;
const failedFiles: string[] = [];
const failedStatementsList: { file: string; statement: string; error: string }[] = [];

async function runSqlFile(filePath: string) {
  const fileName = path.basename(filePath);
  let fileStatementCount = 0;
  let fileSuccessCount = 0;
  let fileFailedCount = 0;
  
  try {
    const sql = fs.readFileSync(filePath, "utf8");
    if (!sql.trim()) {
      console.log(`\n📝 ${fileName} - Empty file, skipping`);
      return;
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📂 FILE: ${fileName}`);
    console.log(`${'='.repeat(60)}`);
    
    // Split by semicolon and filter out empty statements and comments
    const rawStatements = sql.split(';').filter(stmt => stmt.trim());
    
    // Process each statement
    for (let i = 0; i < rawStatements.length; i++) {
      let statement = rawStatements[i].trim();
      if (!statement) continue;
      
      // Skip if it's just a comment line
      if (statement.startsWith('--') && !statement.includes('\n')) {
        console.log(`   📝 Statement ${i + 1}: [COMMENT] ${statement.substring(0, 60)}...`);
        continue;
      }
      
      fileStatementCount++;
      totalStatements++;
      
      // Log the statement type
      const statementType = getStatementType(statement);
      console.log(`\n   🔹 Statement ${fileStatementCount} (${statementType}):`);
      console.log(`      ${statement.substring(0, 150)}${statement.length > 150 ? '...' : ''}`);
      
      try {
        // Run each statement in its own transaction
        await sequelize.query(statement);
        
        fileSuccessCount++;
        successStatements++;
        console.log(`   ✅ Statement ${fileStatementCount} SUCCESS`);
        
        // If it's a CREATE TABLE, show confirmation
        if (statementType === 'CREATE TABLE') {
          const tableName = extractTableName(statement);
          console.log(`      🏗️  Table created: ${tableName}`);
        }
        // If it's an INSERT, show count
        else if (statementType === 'INSERT') {
          console.log(`      📥 Data inserted`);
        }
        
      } catch (stmtErr: any) {
        fileFailedCount++;
        failedStatements++;
        console.log(`   ❌ Statement ${fileStatementCount} FAILED`);
        console.log(`      Error: ${stmtErr.message}`);
        
        failedStatementsList.push({
          file: fileName,
          statement: statement.substring(0, 200),
          error: stmtErr.message
        });
        
        // Don't throw - continue with next statement
      }
    }
    
    // File summary
    console.log(`\n${'-'.repeat(50)}`);
    console.log(`📊 FILE SUMMARY: ${fileName}`);
    console.log(`   Total Statements: ${fileStatementCount}`);
    console.log(`   ✅ Successful: ${fileSuccessCount}`);
    console.log(`   ❌ Failed: ${fileFailedCount}`);
    console.log(`${'-'.repeat(50)}`);
    
    if (fileFailedCount === 0) {
      successScripts++;
      console.log(`✅ FILE COMPLETE: ${fileName} - ALL STATEMENTS SUCCESSFUL`);
    } else {
      failedScripts++;
      failedFiles.push(filePath);
      console.log(`⚠️ FILE COMPLETE: ${fileName} - ${fileSuccessCount} succeeded, ${fileFailedCount} failed`);
    }
    
  } catch (err: any) {
    failedScripts++;
    failedFiles.push(filePath);
    console.error(`\n❌ FILE ERROR: ${fileName}`);
    console.error(`   Error: ${err.message}`);
  }
}

function getStatementType(statement: string): string {
  const upper = statement.toUpperCase();
  if (upper.startsWith('CREATE TABLE')) return 'CREATE TABLE';
  if (upper.startsWith('CREATE OR REPLACE')) return 'CREATE FUNCTION';
  if (upper.startsWith('CREATE')) return 'CREATE';
  if (upper.startsWith('INSERT')) return 'INSERT';
  if (upper.startsWith('UPDATE')) return 'UPDATE';
  if (upper.startsWith('DELETE')) return 'DELETE';
  if (upper.startsWith('ALTER')) return 'ALTER TABLE';
  if (upper.startsWith('DROP')) return 'DROP';
  if (upper.startsWith('SELECT')) return 'SELECT';
  return 'OTHER';
}

function extractTableName(createStatement: string): string {
  const match = createStatement.match(/CREATE\s+TABLE\s+(\w+)/i);
  return match ? match[1] : 'unknown';
}

async function scanFolder(folder: string) {
  if (!fs.existsSync(folder)) {
    console.log(`⚠️  Folder not found: ${folder}`);
    return;
  }
  
  const files = fs.readdirSync(folder);
  
  for (const file of files) {
    const fullPath = path.join(folder, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      console.log(`\n📁 Entering folder: ${file}`);
      await scanFolder(fullPath);
    } else if (file.endsWith(".sql")) {
      totalScripts++;
      await runSqlFile(fullPath);
    }
  }
}

export async function runDbScripts() {
  // Reset counters
  totalScripts = 0;
  successScripts = 0;
  failedScripts = 0;
  totalStatements = 0;
  successStatements = 0;
  failedStatements = 0;
  failedFiles.length = 0;
  failedStatementsList.length = 0;
  
  const baseFolder = path.join(process.cwd(), "db_Scripts");
  
  console.log("\n" + "=".repeat(70));
  console.log("🚀 STARTING DATABASE SCRIPT EXECUTION");
  console.log("=".repeat(70));
  console.log(`📂 Base folder: ${baseFolder}`);
  
  if (!fs.existsSync(baseFolder)) {
    console.error(`❌ Error: db_Scripts folder not found at ${baseFolder}`);
    return;
  }
  
  // Define execution order (files that create tables first)
  const priorityOrder = [
"108Case.sql",
"BitesStings.sql",
"Burns.sql",
"Cardiology.sql",
    "drowning.sql",
    "Hanging.sql",
    "NiceDetails.sql",
      "Poisons.sql",
    "Prem.sql",
    "Stemi.sql",
    "Stroke.sql",
    "Trauma.sql",
    "Triage-EMO.sql",
    "Triage.sql",

   
    
    
  
  ];
  
  console.log("\n📋 Running priority files first...");
  
  // Run priority files in order
  for (const priorityFile of priorityOrder) {
    const filePath = path.join(baseFolder, priorityFile);
    if (fs.existsSync(filePath)) {
      totalScripts++;
      await runSqlFile(filePath);
    }
  }
  
  console.log("\n📋 Scanning remaining folders and files...");
  
  // Then scan all folders for remaining SQL files
  await scanFolder(baseFolder);
  
  // Final Summary
  console.log("\n" + "=".repeat(70));
  console.log("📊 FINAL EXECUTION SUMMARY");
  console.log("=".repeat(70));
  console.log(`📊 Files Processed  : ${totalScripts}`);
  console.log(`   ✅ Successful    : ${successScripts}`);
  console.log(`   ❌ Failed        : ${failedScripts}`);
  console.log(`📊 Statements Processed: ${totalStatements}`);
  console.log(`   ✅ Successful    : ${successStatements}`);
  console.log(`   ❌ Failed        : ${failedStatements}`);
  
  if (failedFiles.length > 0) {
    console.log("\n❌ Failed Files:");
    failedFiles.forEach(f => console.log(`   - ${path.basename(f)}`));
  }
  
  if (failedStatementsList.length > 0) {
    console.log("\n❌ Failed Statements Details:");
    failedStatementsList.slice(0, 10).forEach((item, index) => {
      console.log(`\n   ${index + 1}. File: ${item.file}`);
      console.log(`      Statement: ${item.statement}`);
      console.log(`      Error: ${item.error}`);
    });
    if (failedStatementsList.length > 10) {
      console.log(`   ... and ${failedStatementsList.length - 10} more failed statements`);
    }
  }
  
  console.log("=".repeat(70) + "\n");
}