library(shiny)
library(bs4Dash)
library(fgsea)
library(DT)
library(prompter)
library(shinyWidgets)
library(stringr)
library(data.table)
library(tidyr)
library(shinyjs)
library(waiter)

options(repos = BiocManager::repositories())
options(shiny.maxRequestSize = 30*1024^2)
x <- data.frame("ProteinAccession" = c("P54646","P54646","Q9Y243"), "PhosphoSiteID*" = c("ph181","ph14","ph1525"), "log2FC" = c(1.2,3,-6.55), "pValue*" = c(0.002,0.04,0.66), stringsAsFactors = FALSE,check.names=FALSE)

shinyApp(
  ui = dashboardPage(
    title = "PhosNetVis KEA",
    header = dashboardHeader(tags$head(tags$style('.main-header {display: none}'))),
    sidebar = dashboardSidebar(
      disable = T,
      tags$head(tags$style('.{display: none}'))
    ),
    body = dashboardBody( 
      useSweetAlert(),
      useShinyjs(),
      useWaiter(),
      tags$head(tags$style(HTML("[class*=hint--][aria-label]:after {white-space: pre;}"))),
      tags$head(tags$style(HTML('.content-wrapper {background-color: rgba(0,0,0,0);}'))),
      tags$head(tags$style(HTML('.card-header {padding-top: 5px !important;padding-bottom:5px !important}'))),
      tags$head(tags$style(HTML('.card-body {padding: 0.5rem !important}'))),
      tags$head(tags$style(HTML('.card-title {margin-left: -10px !important}'))),
      tags$head(tags$style(HTML('.input-group {margin-top: -5px;}'))),
      tags$head(tags$style(HTML('#input_pvalue, #output_pvalue, #minSize, #maxSize, #eps {margin-top: -8px}'))),
      tags$head(tags$style(HTML('.radio-group-buttons {margin-top: -8px;}'))),
      tags$head(tags$style(HTML('.bttn-jelly.bttn-danger {background: #e93e8b;}'))),
      tags$head(tags$style(HTML('.bttn-stretch.bttn-danger {color: #e93e8b;}'))),
      tags$head(tags$style(HTML('#upload>.form-group{margin-bottom: 0rem !important;}'))),
      fluidRow(
        
        column(width = 2),
        column(width = 8,
               
               box(
                 title = "Format Data", width = NULL, solidHeader = TRUE, status = "gray", collapsible = F,
                 h6(style ="font-size:15px;margin-top-7px" ,"Welcome! Here you can perform kinase enrichment analysis (KEA)  to identify putative upstream kinases of your differentially phosphorylated protein set. Kinase-substrate interactions are from PhosphoSitePlus [1] and enrichment is performed using fgsea [2]. Upload a .csv file in the format below for enrichment and then to build your interactive 3D phosphoproteomics network!",HTML(paste0("<b>","*optional","</b>"))),
                 column(width = 11.5, dataTableOutput("guide_table"), style = "height:170px; overflow-y: scroll;overflow-x: scroll; margin-top:-10px"),
                 HTML(paste0("<h style='font-size:13px;margin-top:-5px'>","[1] Retrieved from <a href='https://www.phosphosite.org' target='_blank'> phosphosite.org </a> - version Fri Sep 09 09:58:14 EDT 2022<br>[2] Korotkevich G, Sukhov V, Sergushichev A (2019). “Fast gene set enrichment analysis.” bioRxiv. <a href='https://www.biorxiv.org/content/10.1101/060012v3' target='_blank'>doi: 10.1101/060012</a> - version 1.18.0","</h>"))
                 
                 
               ),
               box(
                 title = "Adjust Parameters", width = NULL, solidHeader = TRUE, status = "lightblue", collapsible = F,
                 h6("Input / Output Parameters", style="font-size:15px; font-weight:bold;margin-top:-7px"),
                 fluidRow(style="margin-top:-10px",
                          column(4,
                                 use_prompt(),
                                 add_prompt(
                                   numericInput("input_pvalue", HTML(paste0("<b style='font-size:13px'>Input p-value cutoff</b>")), value = 0.05, min = 0, max = 1, step = 0.01,width="200px"),
                                   position = "bottom", message = "Rows with greater p-values than this cutoff will be eliminated before analysis!\n  (if p value column does not exist in data, cutoff does not effect anything)"
                                 )),
                          
                          column(4,
                                 add_prompt(
                                   numericInput("output_pvalue",HTML(paste0("<b style='font-size:13px'>Output p-value cutoff</b>")), value = 0.05, min = 0, max = 1, step = 0.01,width="200px"),
                                   position = "bottom", message = "Kinase-substrate interactions from analysis output having greater p-values than this cutoff\nwill be eliminated in the phosphoproteomics network!"
                                 )),
                          
                          
                          column(4,
                                 add_prompt(
                                   radioGroupButtons(
                                     inputId = "nameaccession",
                                     label = HTML(paste0("<b style='font-size:13px'>Output network node labels</b>")),
                                     choices = c("gene name", "accession id"),
                                     individual = TRUE,
                                     checkIcon = list(
                                       yes = tags$i(class = "fa fa-circle", 
                                                    style = "color: steelblue"),
                                       no = tags$i(class = "fa fa-circle-o", 
                                                   style = "color: steelblue"))
                                   ),
                                   position = "bottom", message = "Choose the labeling method of the nodes in the network\nthat will be build with the analysis!"
                                 ))
                 ),
                 hr(style="margin-top:-10px"),
                 h6("Enrichment Analysis Parameters", style="font-size:15px; font-weight:bold;margin-top:-10px"),
                 fluidRow( style="margin-top:-10px",
                           column(4,add_prompt(numericInput("minSize", label = HTML(paste0("<b style='font-size:13px'>minSize</b>")), value = 15, min = 0, width="200px"), position = "bottom", message ="Minimal size of a set to test. All pathways below the threshold are excluded.")),
                           column(4,add_prompt(numericInput("maxSize", label = HTML(paste0("<b style='font-size:13px'>maxSize</b>")), value = 100, min = 0, width="200px"), position = "bottom", message ="Maximal size of a set to test. All pathways above the threshold are excluded.")),
                           column(4,add_prompt(numericInput("eps", label = HTML(paste0("<b style='font-size:13px'>eps</b>")), value = 0, min=0, max = 1, step=1e-10, width="200px"), position = "bottom", message ="This parameter sets the boundary for calculating the p value.")) 
                 ),
                 fluidRow(style="margin-top:-10px; margin-left:5px", a(style="font-size:12px",shiny::icon("circle-question"),"Click here for more information about fgsea library's analysis parameters",href="https://bioconductor.org/packages/devel/bioc/manuals/fgsea/man/fgsea.pdf",target="_blank"))
                 
               ),
               box(
                 title = "Upload Data & Run Analysis", width = NULL, solidHeader = TRUE, status = "pink", collapsible = F,
                 fluidRow(style="margin-top:-7px;", 
                          column( id = "upload", width = 4, 
                            fileInput("inputFile", "Upload your .csv file", multiple = FALSE, accept = c("text/csv","text/comma-separated-values,text/plain",".csv")),
                            #style = "margin-top:10px;margin-left:0px",
                            #div(style = "text-align: center; margin-bottom: 20px;", "OR"),  # Add the "OR" text with styling
                            actionButton(inputId = "runOnSample", label = "Run on Sample Data" ,style="margin-left:25%")  # New button for running on sample data
                        ),
                          column(width = 2, 
                                 #fluidRow(
                                  style = "margin-top:12px;padding-left:15px",
                                   actionBttn(inputId = "runanalysis", label = HTML(paste0("<b>Run</b>")), style = "jelly", color = "danger"),
                                   actionLink(inputId = "opentutorial", label = img(src = "image.png", width = "75px", height = "75px"),onclick = "window.open('https://gumuslab.github.io/phosnetvis-docs/docs/tutorials', '_blank'); return false;")
                                # )
                          ),
                          column(width = 2, fluidRow(style="margin-top:26px;margin-left:-15px", hidden(downloadButton('download',"Download")))),
                          column(width = 4, fluidRow(style="margin-top:26px;margin-left:0px", hidden(actionButton(inputId = "gotovis", onclick="window.top.location.href='https://gumuslab.github.io/PhosNetVis/upload-network.html';", label = HTML(paste0("Go to visualization &#10148;")), color = "danger")))),
                 )
               ),
        ),
        column(width = 2)
      )
    ),
    
    dark = NULL
  ),
  
  
  
  server = function(input, output, session) {
    
    output$guide_table <- renderDataTable({
      datatable(x, options = list(dom = 't', columnDefs = list(list(className = 'dt-center', targets = "_all"))), rownames= FALSE)
    })
    
    # Define a function that takes a data frame as an argument
    runAnalysis <- function(results) {
      
      # You can add your analysis logic here
      if(is.null(results)){ 
        sendSweetAlert(session = session, title = "Warning!", text = "Please upload your data or check your data format!", type = "warning")
        req(results)
      }
      else{
        
        if(any(duplicated(results$ProteinAccession)) & !("PhosphoSiteID" %in% colnames(results))){
          sendSweetAlert(session = session, title = "Warning!", text = "Protein Accession column has duplicates. Only one protein ID allowed if no phosphosite IDs are provided for each protein!", type = "warning")
          req(FALSE)
        }
        
        w <- Waiter$new(
          html = spin_dots(), 
          color = transparent(.8)
        )
        
        w$show()
        
        # JEFF'S CODE FOR ANALYSIS !!!
        
        ### START - PhosphoSitePlus kinase-substrate data manipulation
        psp <- read.delim(file = "data/Kinase_Substrate_Dataset_ 090922.txt", quote = "", stringsAsFactors = FALSE)
        psp_human <- psp[which(psp$KIN_ORGANISM == "human"),]
        psp_human$GENE <- toupper(psp_human$GENE)
        psp_human$SUB_GENE <- toupper(psp_human$SUB_GENE)
        psp_human$SUB_ACC_ID <- str_match(string = psp_human$SUB_ACC_ID, pattern = "([A-Z0-9_]+).*")[,2]
        kinsub <- unique(psp_human[,c("KIN_ACC_ID", "SUB_ACC_ID")])
        kinases_gsea <- list()
        kinases <- unique(kinsub$KIN_ACC_ID)
        for (i in 1:length(kinases)) {
          substrates <- unique(kinsub[which(kinsub$KIN_ACC_ID == kinases[i]), "SUB_ACC_ID"])
          kinases_gsea[[i]] <- substrates
        }
        names(kinases_gsea) <- kinases
        ### END - PhosphoSitePlus kinase-substrate data manipulation
        
        ### START - Results file data manipulation
        results[which(results$log2FC == "-Inf"), "log2FC"] <- NA
        results[which(results$log2FC == "Inf"), "log2FC"] <- NA
        
        if("pValue" %in% colnames(results)) # input_pvalue parameter!
        {
          results <- results[which(results$pValue<=input$input_pvalue),]
        }
        
        
        l2fc <- results[which(is.finite(results$log2FC)), "log2FC"]
        l2fc_names <- results[which(is.finite(results$log2FC)), "ProteinAccession"]
        l2fc_ranked <- l2fc[order(l2fc)]
        names(l2fc_ranked) <- l2fc_names[order(l2fc)]
        
        ### END - Results file data manipulation
        
        ### START - GSEA Analysis
        gsea_result <- fgsea(
          pathways = kinases_gsea,
          stats = l2fc_ranked,
          minSize = input$minSize, # analysis minSize parameter
          maxSize = input$maxSize, # analysis maxSize parameter
          eps = input$eps          # analysis eps parameter
        )
        
        # check if gsea results are empty to raise an error!
        if(nrow(gsea_result) == 0){
          w$hide()
          sendSweetAlert(
            session = session,
            title = "No interactions!",
            text = "No kinase-target protein interactions were found by 'fgsea' analysis from your dataset. Please upload a different dataset or change the analysis parameters.",
            type = "error"
          )
          req(nrow(gsea_result)>0)
        }
        
        for (j in 1:nrow(gsea_result)) {
          gsea_result[j, "leadingEdgeText"] <- paste(gsea_result$leadingEdge[[j]], collapse = ";")
        }
        ### END - GSEA Analysis
        
        ### START - GSEA Results to Network Format
        
        # filtering by output pvalue 
        gsea_result <- gsea_result[which(gsea_result$padj<=input$output_pvalue),]
        if(nrow(gsea_result) == 0){
          w$hide()
          sendSweetAlert(
            session = session,
            title = "No significant interactions!",
            text = "No significant kinase-target protein interactions were found by 'fgsea' analysis from your dataset. Please upload a different dataset or change the analysis parameters.",
            type = "error"
          )
          req(nrow(gsea_result)>0)
        }
        
        gsea_min <- gsea_result[,c("pathway","leadingEdge")]
        colnames(gsea_min) <- c("KinaseID","ProteinAccession")
        gsea_min <- unnest(gsea_min, cols = ProteinAccession)
        
        results <- na.omit(results)
        nestingColumns <- colnames(results)
        nestingColumns <-nestingColumns[nestingColumns != "ProteinAccession"]
        results_agg <- results %>% nest(data = nestingColumns)
        
        total <- merge(results_agg,gsea_min, by = "ProteinAccession")
        total <- unnest(total, cols = data)
        
        
        names(total)[names(total) == 'ProteinAccession'] <- 'TargetID'
        
        if(input$nameaccession == "gene name"){
          kinase_gene <- unique(psp_human[,c("GENE","KIN_ACC_ID")])
          substrate_gene <- unique(psp_human[,c("SUB_GENE","SUB_ACC_ID")])
          colnames(kinase_gene) <- c("GENE","ACCESSION")
          colnames(substrate_gene) <- c("GENE","ACCESSION")
          gene_accession_dict <- unique(rbind(kinase_gene, substrate_gene))
          rownames(gene_accession_dict) <- NULL
          
          ## KINASE ACCESSION TO GENE NAME
          total <- merge(x=total, y=gene_accession_dict, by.x="KinaseID", by.y="ACCESSION")[]
          total <- within(total, rm(KinaseID))
          names(total)[names(total) == 'GENE'] <- 'KinaseID'
          
          ## TARGET ACCESSION TO GENE NAME
          total <- merge(x=total, y=gene_accession_dict, by.x="TargetID", by.y="ACCESSION")[]
          total <- within(total, rm(TargetID))
          names(total)[names(total) == 'GENE'] <- 'TargetID'
        }
        
        output$download <- downloadHandler(
          filename = function(){format(Sys.time(), "phosnetvis-network_%d-%m_%H-%M-%S.csv")}, 
          content = function(fname){
            write.csv(total, fname, row.names=FALSE, quote=FALSE)
          }
        )
        
        ### END - GSEA Results to Network Format
        
        w$hide()
        
        sendSweetAlert(
          session = session,
          title = "Network is created succesfully",
          text = "You can download your network and upload it to visualize!",
          type = "success"
        )
        
        shinyjs::show("download")
        
        shinyjs::show("gotovis")
        
      }
    }
    
    # Logic to run analysis when the "Run on Sample Data" button is clicked
    observeEvent(input$runOnSample, {
      results <- read.csv("sample.csv", header = TRUE, sep = ",")  # Load the sample dataset
    
      # For demonstration purposes, let's just print the summary of the sample dataset
      sample_results <- summary(results)
      print(sample_results)
      
      runAnalysis(results)
    })
    
      inputFile <- reactive({
      inFile <- input$inputFile
      
      if (is.null(inFile))
        return(NULL)
      
      df <- tryCatch({
        read.csv(inFile$datapath, header = TRUE, sep = ",")
      }, error = function(e) {
        return(NULL)
      })
      
      column_names <- colnames(df)
      required_columns <- c('ProteinAccession', 'log2FC')
      
      if(!all(required_columns %in% column_names))
        return(NULL)
      
      return(df)
    })
    
    observeEvent(input$runanalysis, {
      results <- inputFile()
      runAnalysis(results)
    })
  }
)