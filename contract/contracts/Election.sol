pragma solidity 0.8.13;

contract Election {
    struct Contestant {
        uint id;
        string name;
        uint voteCount;
        string party;
        uint age;
        string qualification;
    }

    struct VoterRequest {
        string voterId;
        string phoneNumber;
        string name;
        string aadhaarNumber;
        bool exists;
    }

    address public admin;
    uint public contestantsCount;
    
    mapping(uint => Contestant) public contestants;
    mapping(address => bool) public registeredVoters;
    mapping(address => bool) public hasVoted;
    mapping(address => uint) public votes;
    
    mapping(address => VoterRequest) public pendingVoterRequests;
    mapping(address => ContestantRequest) public pendingContestants;

    struct ContestantRequest {
        string name;
        string party;
        uint age;
        string qualification;
        bool exists;
    }

    enum PHASE { REGISTRATION, VOTING, ENDED }
    PHASE public state;

    event ContestantAdded(uint indexed id, string name, string party);
    event ContestantRequested(address indexed requester, string name, string party);
    event VoterRequested(address indexed requester, string name, string voterId);
    event VoterRegistered(address indexed voter);
    event VoteCasted(address indexed voter, uint indexed contestantId);
    event PhaseChanged(PHASE newPhase);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier validState(PHASE requiredState) {
        require(state == requiredState, "Invalid phase for this action");
        _;
    }

    constructor() {
        admin = msg.sender;
        state = PHASE.REGISTRATION;
    }

    function changeState(PHASE newState) public onlyAdmin {
        state = newState;
        emit PhaseChanged(newState);
    }

    // Request to become a contestant
    function requestToContest(string memory _name, string memory _party, uint _age, string memory _qualification) public {
        require(!pendingContestants[msg.sender].exists, "Already requested");
        
        pendingContestants[msg.sender] = ContestantRequest(_name, _party, _age, _qualification, true);
        emit ContestantRequested(msg.sender, _name, _party);
    }

    // Approve contestant request
    function approveContestant(address contestantAddress) public onlyAdmin validState(PHASE.REGISTRATION) {
        require(pendingContestants[contestantAddress].exists, "No request found");

        contestantsCount++;
        ContestantRequest memory req = pendingContestants[contestantAddress];

        contestants[contestantsCount] = Contestant(contestantsCount, req.name, 0, req.party, req.age, req.qualification);
        delete pendingContestants[contestantAddress];

        emit ContestantAdded(contestantsCount, req.name, req.party);
    }

    // Request voter registration with details
    function requestVoterRegistration(string memory _voterId, string memory _phoneNumber, string memory _name, string memory _aadhaarNumber) public {
        require(!registeredVoters[msg.sender], "Already registered");
        require(!pendingVoterRequests[msg.sender].exists, "Request already sent");

        pendingVoterRequests[msg.sender] = VoterRequest(_voterId, _phoneNumber, _name, _aadhaarNumber, true);
        emit VoterRequested(msg.sender, _name, _voterId);
    }

    // Approve voter registration
    function approveVoterRegistration(address voter) public onlyAdmin {
        require(pendingVoterRequests[voter].exists, "No request found");
        
        registeredVoters[voter] = true;
        delete pendingVoterRequests[voter];

        emit VoterRegistered(voter);
    }

    function vote(uint _contestantId) public validState(PHASE.VOTING) {
        require(registeredVoters[msg.sender], "You are not registered to vote");
        require(!hasVoted[msg.sender], "You have already voted");
        require(_contestantId > 0 && _contestantId <= contestantsCount, "Invalid candidate");

        contestants[_contestantId].voteCount++;
        hasVoted[msg.sender] = true;
        votes[msg.sender] = _contestantId;
        emit VoteCasted(msg.sender, _contestantId);
    }

    function getVoteCount(uint _contestantId) public view validState(PHASE.ENDED) returns (uint) {
        require(_contestantId > 0 && _contestantId <= contestantsCount, "Invalid candidate ID");
        return contestants[_contestantId].voteCount;
    }

    function getWinner() public view validState(PHASE.ENDED) returns (uint, string memory, string memory, uint) {
        uint maxVotes = 0;
        uint winnerId;
        for (uint i = 1; i <= contestantsCount; i++) {
            if (contestants[i].voteCount > maxVotes) {
                maxVotes = contestants[i].voteCount;
                winnerId = i;
            }
        }
        require(maxVotes > 0, "No votes have been cast yet"); 
        return (
            contestants[winnerId].id,
            contestants[winnerId].name,
            contestants[winnerId].party,
            contestants[winnerId].voteCount
        );
    }
}
