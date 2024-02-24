import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Typography
} from "@mui/material";

const ReferencesTable = () => {
  const data = [
    {
      DataSource: "Scheel, 2017 [cattle]",
      ArticleName:
        "Global mapping of miRNA-target interactions in cattle (Bos taurus)",
      ArticleLink: "https://www.nature.com/articles/s41598-017-07880-8",
    },
    {
      DataSource: "Broughton, 2016 [worm]",
      ArticleName:
        "Pairing beyond the seed supports microRNA targeting specificity",
      ArticleLink:
        "https://www.cell.com/molecular-cell/pdf/S1097-2765(16)30521-4.pdf",
    },
    {
      DataSource: "Grosswendt, 2014 [worm]",
      ArticleName:
        "Unambiguous identification of miRNA: target site interactions by different types of ligation reactions",
      ArticleLink:
        "https://www.cell.com/molecular-cell/pdf/S1097-2765(14)00356-6.pdf",
    },
    {
      DataSource: "Grosswendt, 2014 [mouse]",
      ArticleName:
        "Unambiguous identification of miRNA: target site interactions by different types of ligation reactions",
      ArticleLink:
        "https://www.cell.com/molecular-cell/pdf/S1097-2765(14)00356-6.pdf",
    },
    {
      DataSource: "Grosswendt, 2014 [human]",
      ArticleName:
        "Unambiguous identification of miRNA: target site interactions by different types of ligation reactions",
      ArticleLink:
        "https://www.cell.com/molecular-cell/pdf/S1097-2765(14)00356-6.pdf",
    },
    {
      DataSource: "Fu, 2020 [mosquito]",
      ArticleName:
        "Dynamic miRNA-mRNA interactions coordinate gene expression in adult Anopheles gambiae",
      ArticleLink:
        "https://journals.plos.org/plosgenetics/article?id=10.1371/journal.pgen.1008765",
    },
    {
      DataSource: "Moore, 2015 [mouse]",
      ArticleName:
        "miRNA–target chimeras reveal miRNA 3-end pairing as a major determinant of Argonaute target specificity",
      ArticleLink: "https://www.nature.com/articles/ncomms98648",
    },
    {
      DataSource: "Moore, 2015 [human]",
      ArticleName:
        "miRNA–target chimeras reveal miRNA 3-end pairing as a major determinant of Argonaute target specificity",
      ArticleLink: "https://www.nature.com/articles/ncomms9864",
    },
    {
      DataSource: "Kozar, 2021 [human]",
      ArticleName:
        "Cross-linking ligation and sequencing of hybrids (qCLASH) reveals an unpredicted miRNA Targetome in melanoma cells",
      ArticleLink: "https://www.mdpi.com/2072-6694/13/5/1096",
    },
    {
      DataSource: "Helwak, 2013 [human]",
      ArticleName:
        "Mapping the human miRNA interactome by clash reveals frequent noncanonical binding",
      ArticleLink:
        "https://www.cell.com/fulltext/S0092-8674(13)00439-X?large_figure=true&code=cell-site",
    },
  ];

  return (
  <>
    <div style={{width:'100%', display:'flex', justifyContent:'center', marginTop:'60px', flexDirection:'column', marginBottom:'30px'}}>
    <Typography color={'primary'} 
                    sx={{                                    
                        fontWeight: 700,
                        fontSize: {xs: 'medium', md: 'x-large'},  
                        marginBottom:'30px'                
                        }}>
                        Articles and links 
                </Typography>
    <TableContainer style={{maxWidth:'600px', margin:'auto'}} component={Paper}>
      <Table>
        <TableHead style={{backgroundColor:'#822F82'}}>
          <TableRow>
            <TableCell><b style={{color:'white'}}>Data source</b></TableCell>
            <TableCell><b style={{color:'white'}}>Article name</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.DataSource}</TableCell>
              <TableCell>
                <Link
                  href={item.ArticleLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.ArticleName}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    </>
  );
};

export default ReferencesTable;