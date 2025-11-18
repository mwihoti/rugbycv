// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";

contract JobBoard is Ownable {
    struct Job {
        string title;
        string description;
        uint256 salaryKsh;       // in KSh (e.g., 45000)
        address club;
        bool active;
        uint256 deadline;        // unix timestamp
    }

    Job[] public jobs;
    mapping(uint256 => address[]) public applications;

    event JobPosted(uint256 indexed jobId, string title, address indexed club);
    event AppliedToJob(uint256 indexed jobId, address indexed applicant);

    constructor() Ownable(msg.sender) {}

    function postJob(
        string memory title,
        string memory description,
        uint256 salaryKsh,
        uint256 deadline
    ) external {
        uint256 jobId = jobs.length;
        jobs.push(Job({
            title: title,
            description: description,
            salaryKsh: salaryKsh,
            club: msg.sender,
            active: true,
            deadline: deadline
        }));
        emit JobPosted(jobId, title, msg.sender);
    }

    // Renamed from "apply" → "applyToJob" to avoid Solidity reserved word conflict
    function applyToJob(uint256 jobId) external {
        require(jobs[jobId].active, "Job is not active");
        require(block.timestamp < jobs[jobId].deadline, "Application deadline passed");

        applications[jobId].push(msg.sender);
        emit AppliedToJob(jobId, msg.sender);
    }

    function deactivateJob(uint256 jobId) external {
        require(jobs[jobId].club == msg.sender, "Only club can deactivate");
        jobs[jobId].active = false;
    }

    // Helper view functions
    function getJob(uint256 jobId) external view returns (Job memory) {
        return jobs[jobId];
    }

    function getApplicants(uint256 jobId) external view returns (address[] memory) {
        return applications[jobId];
    }
}