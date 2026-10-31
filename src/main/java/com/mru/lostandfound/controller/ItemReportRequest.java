package com.mru.lostandfound.controller;

public class ItemReportRequest {
    private String reporterName;
    private String reporterEmail;
    private String reportType;
    private String category;
    private String title;
    private String brand;
    private String description;
    private String location;
    private String imageUrl;
    private String verificationSecret;

    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }

    public String getReporterEmail() { return reporterEmail; }
    public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }

    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getVerificationSecret() { return verificationSecret; }
    public void setVerificationSecret(String verificationSecret) { this.verificationSecret = verificationSecret; }
}
