import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

const SAQ_DATA = {
  requirements: [
    {
      id: "R1", number: "1", title: "Network Security Controls", weight: 9,
      controls: [
        { id: "R1-C1", ref: "1.1.1", risk_level: "high", question: "Are all security policies and operational procedures for network security controls documented, in use, and known to all affected parties?" },
        { id: "R1-C2", ref: "1.1.2", risk_level: "high", question: "Are roles and responsibilities for managing network security controls assigned, documented, and understood by all affected parties?" },
        { id: "R1-C3", ref: "1.2.1", risk_level: "critical", question: "Are configuration standards for NSC rulesets defined and implemented, covering all allowed services, protocols, and ports with business justification?" },
        { id: "R1-C4", ref: "1.2.2", risk_level: "high", question: "Are all changes to network connections and NSC configurations approved and managed via a formal change control process?" },
        { id: "R1-C5", ref: "1.2.3", risk_level: "critical", question: "Is an accurate network diagram maintained showing all connections between the CDE and other networks including any wireless networks?" },
        { id: "R1-C6", ref: "1.2.4", risk_level: "critical", question: "Is an accurate data-flow diagram maintained showing all account data flows across systems and networks, updated when the environment changes?" },
        { id: "R1-C7", ref: "1.2.5", risk_level: "high", question: "Are all allowed services, protocols, and ports identified, approved, and documented with a defined business need?" },
        { id: "R1-C8", ref: "1.2.6", risk_level: "high", question: "Are security features defined and implemented for all insecure services, protocols, or ports that are in use?" },
        { id: "R1-C9", ref: "1.2.7", risk_level: "high", question: "Are NSC configurations reviewed at least once every six months to confirm they remain relevant and effective?" },
        { id: "R1-C10", ref: "1.2.8", risk_level: "high", question: "Are configuration files for NSCs secured from unauthorised access and kept consistent with active network configurations?" },
        { id: "R1-C11", ref: "1.3.1", risk_level: "critical", question: "Is inbound traffic to the CDE restricted to only that which is necessary, with all other inbound traffic denied by default?" },
        { id: "R1-C12", ref: "1.3.2", risk_level: "critical", question: "Is outbound traffic from the CDE restricted to only that which is necessary, with all other outbound traffic denied by default?" },
        { id: "R1-C13", ref: "1.3.3", risk_level: "high", question: "Are NSCs installed between all wireless networks and the CDE, denying or controlling all traffic between the wireless environment and the CDE?" },
        { id: "R1-C14", ref: "1.4.1", risk_level: "critical", question: "Are NSCs implemented between trusted and untrusted networks?" },
        { id: "R1-C15", ref: "1.4.2", risk_level: "critical", question: "Is inbound traffic from untrusted networks restricted to communications that were initiated from within the trusted network?" },
        { id: "R1-C16", ref: "1.4.3", risk_level: "high", question: "Are anti-spoofing measures implemented to detect and block forged source IP addresses entering the trusted network?" },
        { id: "R1-C17", ref: "1.4.4", risk_level: "critical", question: "Are system components storing cardholder data prevented from being directly accessible from untrusted networks?" },
        { id: "R1-C18", ref: "1.4.5", risk_level: "high", question: "Is the disclosure of internal IP addresses and routing information to untrusted networks restricted?" },
        { id: "R1-C19", ref: "1.5.1", risk_level: "high", question: "Are security controls applied on computing devices connecting to both untrusted networks and the CDE to prevent untrusted network threats from reaching the CDE?" },
      ]
    },
    {
      id: "R2", number: "2", title: "Secure Configurations", weight: 8,
      controls: [
        { id: "R2-C1", ref: "2.1.1", risk_level: "high", question: "Are all security policies and operational procedures for system configuration documented, in use, and known to all affected parties?" },
        { id: "R2-C2", ref: "2.1.2", risk_level: "high", question: "Are roles and responsibilities for managing secure configurations assigned, documented, and understood?" },
        { id: "R2-C3", ref: "2.2.1", risk_level: "high", question: "Are configuration standards developed, implemented, and maintained for all system components in the CDE?" },
        { id: "R2-C4", ref: "2.2.2", risk_level: "critical", question: "Are vendor-supplied default accounts managed — removed, disabled, or default passwords changed before system deployment?" },
        { id: "R2-C5", ref: "2.2.3", risk_level: "high", question: "Are primary functions requiring different security levels managed so that only one primary function exists per system component?" },
        { id: "R2-C6", ref: "2.2.4", risk_level: "high", question: "Are only necessary services, protocols, daemons, and functions enabled — with all unnecessary functionality removed or disabled?" },
        { id: "R2-C7", ref: "2.2.5", risk_level: "high", question: "If any insecure services, protocols, or daemons are present, is a business justification documented and additional security features implemented?" },
        { id: "R2-C8", ref: "2.2.6", risk_level: "medium", question: "Are system security parameters configured to prevent misuse?" },
        { id: "R2-C9", ref: "2.2.7", risk_level: "critical", question: "Are all non-console administrative access sessions encrypted using strong cryptography such as SSH, VPN, or TLS?" },
        { id: "R2-C10", ref: "2.3.1", risk_level: "high", question: "For wireless environments connected to the CDE, are all wireless vendor defaults changed at installation including SSIDs, passwords, and SNMP?" },
        { id: "R2-C11", ref: "2.3.2", risk_level: "high", question: "For wireless environments connected to the CDE, are wireless encryption keys changed when personnel with knowledge of the key leave?" },
      ]
    },
    {
      id: "R3", number: "3", title: "Protect Stored Account Data", weight: 10,
      controls: [
        { id: "R3-C1", ref: "3.1.1", risk_level: "high", question: "Are all security policies and operational procedures for protecting stored account data documented, in use, and known to all affected parties?" },
        { id: "R3-C2", ref: "3.1.2", risk_level: "high", question: "Are roles and responsibilities for protecting stored account data assigned, documented, and understood?" },
        { id: "R3-C3", ref: "3.2.1", risk_level: "critical", question: "Is account data storage kept to the minimum necessary, with a documented data retention and disposal policy and a secure deletion process?" },
        { id: "R3-C4", ref: "3.3.1", risk_level: "critical", question: "Is sensitive authentication data (SAD) — full track data, CVV2/CVC2, PIN/PIN block — NOT retained after authorisation, even if encrypted?" },
        { id: "R3-C5", ref: "3.3.1.1", risk_level: "critical", question: "Are the full contents of any track (magnetic stripe, chip, or elsewhere) NOT stored after the authorisation process?" },
        { id: "R3-C6", ref: "3.3.1.2", risk_level: "critical", question: "Is the card verification code (CVV2/CVC2/CID/CAV2) NOT stored after completion of the authorisation process?" },
        { id: "R3-C7", ref: "3.3.1.3", risk_level: "critical", question: "Is the PIN and PIN block NOT stored after completion of the authorisation process?" },
        { id: "R3-C8", ref: "3.3.2", risk_level: "critical", question: "Is SAD that is stored electronically prior to completion of authorisation protected using strong cryptography?" },
        { id: "R3-C9", ref: "3.3.3", risk_level: "critical", question: "For issuers and companies supporting issuing services that store SAD: is there a documented business justification and is the data protected with strong cryptography?" },
        { id: "R3-C10", ref: "3.4.1", risk_level: "high", question: "Is PAN masked when displayed so that only personnel with a legitimate business need can see more than the first six or last four digits?" },
        { id: "R3-C11", ref: "3.4.2", risk_level: "high", question: "Are technical controls implemented to prevent copy or relocation of PAN when using remote-access technologies?" },
        { id: "R3-C12", ref: "3.5.1", risk_level: "critical", question: "Is PAN rendered unreadable anywhere it is stored using strong one-way hashing, truncation, index tokens, or strong cryptography?" },
        { id: "R3-C13", ref: "3.5.1.1", risk_level: "critical", question: "If hashing is used to render PAN unreadable, are keyed cryptographic hashes used with the hash of the entire PAN?" },
        { id: "R3-C14", ref: "3.5.1.2", risk_level: "critical", question: "If disk-level or partition-level encryption is used, is it implemented only on removable electronic media OR with logical access managed separately from OS access controls?" },
        { id: "R3-C15", ref: "3.5.1.3", risk_level: "critical", question: "If disk-level or partition-level encryption is used, are decryption keys not associated with user accounts and stored separately from the data they protect?" },
        { id: "R3-C16", ref: "3.6.1", risk_level: "critical", question: "Are procedures defined and implemented to protect cryptographic keys used to protect stored account data against disclosure and misuse?" },
        { id: "R3-C17", ref: "3.6.1.1", risk_level: "critical", question: "For service providers only: Is a documented description of the cryptographic architecture maintained, including all algorithms, protocols, and key usage details?" },
        { id: "R3-C18", ref: "3.6.1.2", risk_level: "critical", question: "Are secret and private keys used to protect stored account data protected with at least two of: encryption with a key-encrypting key, within a secure cryptographic device, or as at least two full-length key components?" },
        { id: "R3-C19", ref: "3.6.1.3", risk_level: "critical", question: "Is access to cleartext cryptographic key components restricted to the fewest number of custodians necessary?" },
        { id: "R3-C20", ref: "3.6.1.4", risk_level: "high", question: "Are cryptographic keys stored in the fewest possible locations to minimise risk of exposure?" },
        { id: "R3-C21", ref: "3.7.1", risk_level: "critical", question: "Is there a documented key management policy and procedure covering key generation, distribution, storage, access, retirement, replacement, and destruction?" },
        { id: "R3-C22", ref: "3.7.2", risk_level: "high", question: "Are key management procedures implemented to ensure secure distribution of cryptographic keys — never distributed insecurely and only to authorised custodians?" },
        { id: "R3-C23", ref: "3.7.3", risk_level: "high", question: "Are key management procedures implemented to ensure secure storage of cryptographic keys, including in the fewest possible locations and forms?" },
        { id: "R3-C24", ref: "3.7.4", risk_level: "high", question: "Are cryptographic key changes performed when keys reach end of their cryptoperiod or are known or suspected to be compromised?" },
        { id: "R3-C25", ref: "3.7.5", risk_level: "high", question: "Are key management procedures implemented covering retirement, replacement, or destruction of keys to ensure old keys are not used beyond their cryptoperiod?" },
        { id: "R3-C26", ref: "3.7.6", risk_level: "high", question: "Where manual cleartext cryptographic key management operations are performed, are split knowledge and dual control used?" },
        { id: "R3-C27", ref: "3.7.7", risk_level: "high", question: "Are key management procedures implemented to prevent unauthorised substitution of cryptographic keys?" },
        { id: "R3-C28", ref: "3.7.8", risk_level: "high", question: "Are key management procedures implemented so that cryptographic key custodians formally acknowledge in writing their key custodian responsibilities?" },
        { id: "R3-C29", ref: "3.7.9", risk_level: "high", question: "For service providers only: If vendor-provided key management systems are used, do key custodians formally acknowledge their responsibilities per vendor guidance?" },
      ]
    },
    {
      id: "R4", number: "4", title: "Cryptography in Transit", weight: 9,
      controls: [
        { id: "R4-C1", ref: "4.1.1", risk_level: "high", question: "Are all security policies and operational procedures for cryptography during transmission documented, in use, and known to all affected parties?" },
        { id: "R4-C2", ref: "4.1.2", risk_level: "high", question: "Are roles and responsibilities for managing cryptography in transit assigned, documented, and understood?" },
        { id: "R4-C3", ref: "4.2.1", risk_level: "critical", question: "Is strong cryptography (TLS 1.2 minimum, TLS 1.3 recommended) used to safeguard PAN during transmission over open, public networks, with only trusted keys/certificates accepted?" },
        { id: "R4-C4", ref: "4.2.1", risk_level: "critical", question: "Are SSL, early TLS (1.0 and 1.1), and all weak cipher suites completely disabled with no fallback permitted?" },
        { id: "R4-C5", ref: "4.2.1.1", risk_level: "high", question: "Is an inventory of all trusted keys and certificates used for PAN transmission maintained and kept current?" },
        { id: "R4-C6", ref: "4.2.1.2", risk_level: "high", question: "Are wireless networks transmitting PAN or connected to the CDE using industry best practices for strong cryptography for authentication and transmission?" },
        { id: "R4-C7", ref: "4.2.2", risk_level: "high", question: "Is PAN secured with strong cryptography when sent via end-user messaging technologies such as email, SMS, or instant messaging?" },
      ]
    },
    {
      id: "R5", number: "5", title: "Malware Protection", weight: 7,
      controls: [
        { id: "R5-C1", ref: "5.1.1", risk_level: "high", question: "Are all security policies and operational procedures for malware protection documented, in use, and known to all affected parties?" },
        { id: "R5-C2", ref: "5.1.2", risk_level: "high", question: "Are roles and responsibilities for malware protection assigned, documented, and understood?" },
        { id: "R5-C3", ref: "5.2.1", risk_level: "high", question: "Is an anti-malware solution deployed on all system components that are commonly affected by malware, particularly those in the CDE?" },
        { id: "R5-C4", ref: "5.2.2", risk_level: "high", question: "Is the deployed anti-malware solution capable of detecting all known types of malware and protecting against or mitigating their effects?" },
        { id: "R5-C5", ref: "5.2.3", risk_level: "medium", question: "Are system components not at risk from malware evaluated periodically, with evaluations documented and retained?" },
        { id: "R5-C6", ref: "5.2.3.1", risk_level: "medium", question: "Is the frequency of periodic evaluations of system components not at risk for malware defined in the entity's targeted risk analysis?" },
        { id: "R5-C7", ref: "5.3.1", risk_level: "high", question: "Is anti-malware kept current via automatic updates?" },
        { id: "R5-C8", ref: "5.3.2", risk_level: "high", question: "Does the anti-malware solution perform periodic scans AND real-time or continuous behavioural analysis?" },
        { id: "R5-C9", ref: "5.3.2.1", risk_level: "medium", question: "If periodic malware scans are performed, is the frequency defined in the entity's targeted risk analysis?" },
        { id: "R5-C10", ref: "5.3.3", risk_level: "high", question: "For removable electronic media, does the anti-malware solution perform automatic scans when the media is inserted, connected, or logically mounted?" },
        { id: "R5-C11", ref: "5.3.4", risk_level: "high", question: "Are audit logs for the anti-malware solution enabled and retained in accordance with Requirement 10.5?" },
        { id: "R5-C12", ref: "5.3.5", risk_level: "high", question: "Are anti-malware mechanisms configured so they cannot be disabled or altered by users, unless specifically documented and management-approved on a case-by-case basis?" },
        { id: "R5-C13", ref: "5.4.1", risk_level: "medium", question: "Are processes and automated mechanisms in place to detect and protect personnel against phishing attacks, including email filtering and security awareness?" },
      ]
    },
    {
      id: "R6", number: "6", title: "Secure Systems & Software", weight: 9,
      controls: [
        { id: "R6-C1", ref: "6.1.1", risk_level: "high", question: "Are all security policies and operational procedures for developing and maintaining secure systems documented and known to all affected parties?" },
        { id: "R6-C2", ref: "6.1.2", risk_level: "high", question: "Are roles and responsibilities for secure systems and software development assigned, documented, and understood?" },
        { id: "R6-C3", ref: "6.2.1", risk_level: "high", question: "Are bespoke and custom software developed securely in accordance with documented security policies and a secure SDLC?" },
        { id: "R6-C4", ref: "6.2.2", risk_level: "high", question: "Are software development personnel trained at least annually on secure coding techniques including how to avoid common vulnerabilities?" },
        { id: "R6-C5", ref: "6.2.3", risk_level: "high", question: "Is bespoke and custom software reviewed before being released to production to identify and correct potential vulnerabilities?" },
        { id: "R6-C6", ref: "6.2.3.1", risk_level: "high", question: "If manual code reviews are performed for bespoke and custom software, are the reviews conducted by individuals other than the originating code author?" },
        { id: "R6-C7", ref: "6.2.4", risk_level: "high", question: "Do software development practices prevent or mitigate injection flaws, XSS, broken access control, and all OWASP Top 10 vulnerabilities?" },
        { id: "R6-C8", ref: "6.3.1", risk_level: "critical", question: "Are security vulnerabilities identified and managed using a risk ranking process classifying vulnerabilities as critical, high, medium, or low?" },
        { id: "R6-C9", ref: "6.3.2", risk_level: "high", question: "Is an inventory of bespoke and custom software maintained to facilitate vulnerability and patch management?" },
        { id: "R6-C10", ref: "6.3.3", risk_level: "critical", question: "Are all system components protected from known vulnerabilities — critical patches installed within one month, others within a defined risk-ranked timeframe?" },
        { id: "R6-C11", ref: "6.4.1", risk_level: "critical", question: "Are public-facing web applications protected by a WAF in active blocking mode, or assessed via regular application security testing?" },
        { id: "R6-C12", ref: "6.4.2", risk_level: "critical", question: "Is an automated technical solution deployed that continually detects and prevents web-based attacks against public-facing web applications?" },
        { id: "R6-C13", ref: "6.4.3", risk_level: "critical", question: "Are all payment page scripts loaded in the consumer's browser managed, authorised, their integrity ensured, and justification documented?" },
        { id: "R6-C14", ref: "6.5.1", risk_level: "high", question: "Are changes to all system components managed via a formal change control process including documentation, testing, approval, and back-out plans?" },
        { id: "R6-C15", ref: "6.5.2", risk_level: "high", question: "Upon completion of a significant change, are all relevant PCI DSS requirements verified and documents updated accordingly?" },
        { id: "R6-C16", ref: "6.5.3", risk_level: "high", question: "Are pre-production environments separated from production environments with separation enforced by access controls?" },
        { id: "R6-C17", ref: "6.5.4", risk_level: "high", question: "Are roles and functions of production and pre-production environments separated to prevent unauthorised access or changes to production?" },
        { id: "R6-C18", ref: "6.5.5", risk_level: "high", question: "Are live PANs not used in pre-production environments except where the environment is included in scope of a PCI DSS assessment?" },
        { id: "R6-C19", ref: "6.5.6", risk_level: "high", question: "Are test data and test accounts removed before production systems become active?" },
      ]
    },
    {
      id: "R7", number: "7", title: "Restrict Access by Need to Know", weight: 8,
      controls: [
        { id: "R7-C1", ref: "7.1.1", risk_level: "high", question: "Are all security policies and operational procedures for restricting access documented, in use, and known to all affected parties?" },
        { id: "R7-C2", ref: "7.1.2", risk_level: "high", question: "Are roles and responsibilities for managing access controls assigned, documented, and understood?" },
        { id: "R7-C3", ref: "7.2.1", risk_level: "critical", question: "Is an access control model defined and implemented that enforces least privilege and default deny-all for all access to system components and cardholder data?" },
        { id: "R7-C4", ref: "7.2.2", risk_level: "critical", question: "Is access assigned to users based on job classification and function, with minimum necessary access granted?" },
        { id: "R7-C5", ref: "7.2.3", risk_level: "high", question: "Is required privilege escalation approved by authorised personnel, time-limited, and logged?" },
        { id: "R7-C6", ref: "7.2.4", risk_level: "high", question: "Are all user accounts and related access privileges reviewed at least once every six months to ensure they remain appropriate?" },
        { id: "R7-C7", ref: "7.2.5", risk_level: "high", question: "Are all application and system account privileges assigned and managed based on least-privilege principles?" },
        { id: "R7-C8", ref: "7.2.5.1", risk_level: "high", question: "Is all access by application and system accounts and related access privileges reviewed periodically to confirm they remain appropriate?" },
        { id: "R7-C9", ref: "7.2.6", risk_level: "high", question: "Is all user access to query repositories of stored cardholder data restricted to the minimum access required for the job function?" },
        { id: "R7-C10", ref: "7.3.1", risk_level: "high", question: "Is an access control system in place that restricts access based on a user's need to know and is set to deny-all by default?" },
        { id: "R7-C11", ref: "7.3.2", risk_level: "high", question: "Is the access control system configured to enforce access based on job classification and function?" },
        { id: "R7-C12", ref: "7.3.3", risk_level: "critical", question: "Is the access control system set to deny-all by default, granting access only to explicitly authorised individuals?" },
      ]
    },
    {
      id: "R8", number: "8", title: "Authentication & Identity", weight: 9,
      controls: [
        { id: "R8-C1", ref: "8.1.1", risk_level: "high", question: "Are all security policies and operational procedures for identification and authentication documented, in use, and known to all affected parties?" },
        { id: "R8-C2", ref: "8.1.2", risk_level: "high", question: "Are roles and responsibilities for managing identification and authentication assigned, documented, and understood?" },
        { id: "R8-C3", ref: "8.2.1", risk_level: "critical", question: "Are all users assigned a unique ID before accessing system components or cardholder data, with group, shared, or generic accounts prohibited?" },
        { id: "R8-C4", ref: "8.2.2", risk_level: "high", question: "Are group, shared, or generic IDs only used when necessary on an exception basis, with shared authentication credentials managed and activities attributable to each user?" },
        { id: "R8-C5", ref: "8.2.3", risk_level: "high", question: "For service providers only: Do service providers with remote access to customer premises use unique authentication credentials per customer?" },
        { id: "R8-C6", ref: "8.2.4", risk_level: "high", question: "Are addition, deletion, and modification of user IDs, authentication factors, and access managed via documented authorisation?" },
        { id: "R8-C7", ref: "8.2.5", risk_level: "high", question: "Is access for terminated users immediately revoked — including removal or disabling of accounts within the same day of termination?" },
        { id: "R8-C8", ref: "8.2.6", risk_level: "high", question: "Are inactive user accounts removed or disabled within 90 days of inactivity?" },
        { id: "R8-C9", ref: "8.2.7", risk_level: "high", question: "Are accounts used by third parties to access, support, or maintain system components disabled when not in use and enabled only for the required timeframe?" },
        { id: "R8-C10", ref: "8.2.8", risk_level: "medium", question: "If a user session has been idle for more than 15 minutes, is re-authentication required to reactivate the terminal or session?" },
        { id: "R8-C11", ref: "8.3.1", risk_level: "critical", question: "Are all user accesses to system components authenticated via at least one authentication factor: something you know, have, or are?" },
        { id: "R8-C12", ref: "8.3.2", risk_level: "critical", question: "Is strong cryptography used to render all authentication factors unreadable during transmission and storage on all system components?" },
        { id: "R8-C13", ref: "8.3.3", risk_level: "high", question: "Is user identity verified before modifying any authentication factor — for example, before resetting a password or issuing a new token?" },
        { id: "R8-C14", ref: "8.3.4", risk_level: "high", question: "Are invalid authentication attempts limited — locking the account after not more than 10 attempts with a lockout of at least 30 minutes or until an admin resets?" },
        { id: "R8-C15", ref: "8.3.5", risk_level: "high", question: "If passwords are used as authentication factors, are they set and reset for each user to a unique value at first use and upon reset, requiring change upon next use?" },
        { id: "R8-C16", ref: "8.3.6", risk_level: "high", question: "If passwords are used, do they meet a minimum length of at least 12 characters (or 8 if the system does not support 12) with numeric and alphabetic characters?" },
        { id: "R8-C17", ref: "8.3.7", risk_level: "high", question: "Are individuals prevented from submitting a new password that is the same as any of the last four passwords used?" },
        { id: "R8-C18", ref: "8.3.8", risk_level: "medium", question: "Are authentication policies and procedures documented and communicated to all users, including guidance on selecting strong authentication factors and not sharing credentials?" },
        { id: "R8-C19", ref: "8.3.9", risk_level: "medium", question: "If passwords are the only authentication factor, are they changed at least once every 90 days OR dynamically analysed for real-time risk assessment?" },
        { id: "R8-C20", ref: "8.3.10", risk_level: "high", question: "For service providers only: If passwords are the only authentication factor for customer users, is guidance provided on periodic password changes and avoidance of reuse?" },
        { id: "R8-C21", ref: "8.3.10.1", risk_level: "high", question: "For service providers only: Are passwords for customer user accounts changed at least once every 90 days OR access automatically blocked after inactivity?" },
        { id: "R8-C22", ref: "8.3.11", risk_level: "high", question: "Where physical or logical security tokens, smart cards, or certificates are used as authentication factors, are they assigned to individual users and not shared?" },
        { id: "R8-C23", ref: "8.4.1", risk_level: "critical", question: "Is MFA implemented for all non-console access into the CDE for personnel with administrative access?" },
        { id: "R8-C24", ref: "8.4.2", risk_level: "critical", question: "Is MFA implemented for ALL access into the CDE — not just for administrators or remote access?" },
        { id: "R8-C25", ref: "8.4.3", risk_level: "critical", question: "Is MFA implemented for all remote network access originating from outside the entity's network that could access or impact the CDE?" },
        { id: "R8-C26", ref: "8.5.1", risk_level: "high", question: "Is MFA implemented so that it cannot be bypassed by any user including administrative users, with replay attack protection in place?" },
        { id: "R8-C27", ref: "8.6.1", risk_level: "high", question: "Are system and application accounts and related authentication factors managed via policies covering their use, security, and lifecycle with periodic access reviews?" },
        { id: "R8-C28", ref: "8.6.2", risk_level: "critical", question: "Are passwords and passphrases for system or application accounts not hard-coded in scripts, configuration files, or bespoke and custom software?" },
        { id: "R8-C29", ref: "8.6.3", risk_level: "high", question: "Are passwords and passphrases for system and application accounts protected against misuse with appropriate complexity and periodic rotation policies?" },
      ]
    },
    {
      id: "R9", number: "9", title: "Physical Access Controls", weight: 6,
      controls: [
        { id: "R9-C1", ref: "9.1.1", risk_level: "medium", question: "Are all security policies and operational procedures for physical access restrictions documented, in use, and known to all affected parties?" },
        { id: "R9-C2", ref: "9.1.2", risk_level: "medium", question: "Are roles and responsibilities for managing physical access controls assigned, documented, and understood?" },
        { id: "R9-C3", ref: "9.2.1", risk_level: "high", question: "Are appropriate facility entry controls in place to restrict access to the CDE, including badge readers, door locks, and CCTV?" },
        { id: "R9-C4", ref: "9.2.1.1", risk_level: "high", question: "Is individual physical access to sensitive areas within the CDE monitored with video cameras or physical access control mechanisms, with data retained for at least 90 days?" },
        { id: "R9-C5", ref: "9.2.2", risk_level: "high", question: "Are physical and/or logical controls implemented to restrict access to publicly accessible network jacks within the facility?" },
        { id: "R9-C6", ref: "9.2.3", risk_level: "high", question: "Is physical access to wireless access points, gateways, networking hardware, and communication lines restricted?" },
        { id: "R9-C7", ref: "9.2.4", risk_level: "high", question: "Is access to consoles in sensitive areas restricted via locking when not in use to prevent unauthorised access?" },
        { id: "R9-C8", ref: "9.3.1", risk_level: "high", question: "Are procedures implemented for authorising and managing physical access of personnel to the CDE, including access granting, modification, and revocation?" },
        { id: "R9-C9", ref: "9.3.1.1", risk_level: "high", question: "Is physical access to sensitive areas within the CDE managed so that access is granted based on individual job function and revoked immediately when no longer required?" },
        { id: "R9-C10", ref: "9.3.2", risk_level: "high", question: "Are procedures implemented for authorising and managing visitor physical access to the CDE, including identification, escort, and revocation of access?" },
        { id: "R9-C11", ref: "9.3.3", risk_level: "medium", question: "Are visitor badges or identification surrendered or deactivated before visitors leave the facility or at the date of expiration?" },
        { id: "R9-C12", ref: "9.3.4", risk_level: "medium", question: "Is a visitor log maintained for physical access to sensitive areas and retained for at least three months?" },
        { id: "R9-C13", ref: "9.4.1", risk_level: "high", question: "Is all media with cardholder data physically secured?" },
        { id: "R9-C14", ref: "9.4.1.1", risk_level: "high", question: "Are offline media backups with cardholder data stored in a secure location, with the security reviewed at least annually?" },
        { id: "R9-C15", ref: "9.4.1.2", risk_level: "high", question: "Is the security of the offline media backup location reviewed at least once every 12 months to confirm adequate physical security controls are in place?" },
        { id: "R9-C16", ref: "9.4.2", risk_level: "high", question: "Is all media with cardholder data classified so the sensitivity of the data can be determined?" },
        { id: "R9-C17", ref: "9.4.3", risk_level: "high", question: "Is media with cardholder data sent outside the facility secured — logged, sent via secured courier or trackable method, and approved by management?" },
        { id: "R9-C18", ref: "9.4.4", risk_level: "high", question: "Does management approve all media with cardholder data moved outside the facility, including when distributed to individuals?" },
        { id: "R9-C19", ref: "9.4.5", risk_level: "high", question: "Is an inventory log of all electronic media containing cardholder data maintained, with inventories performed at least annually?" },
        { id: "R9-C20", ref: "9.4.5.1", risk_level: "high", question: "Are inventories of electronic media with cardholder data performed at least once every 12 months?" },
        { id: "R9-C21", ref: "9.4.6", risk_level: "high", question: "Is hard-copy media with cardholder data destroyed when no longer needed for business or legal reasons?" },
        { id: "R9-C22", ref: "9.4.7", risk_level: "high", question: "Is electronic media with cardholder data destroyed when no longer needed, rendering the data unrecoverable?" },
        { id: "R9-C23", ref: "9.5.1", risk_level: "critical", question: "Are POI devices that capture payment card data protected from tampering and unauthorised substitution?" },
        { id: "R9-C24", ref: "9.5.1.1", risk_level: "critical", question: "Is an up-to-date list of POI devices maintained, including device make/model, location, and device serial number or other unique identifier?" },
        { id: "R9-C25", ref: "9.5.1.2", risk_level: "critical", question: "Are POI device surfaces periodically inspected to detect tampering or substitution, with documented inspection procedures?" },
        { id: "R9-C26", ref: "9.5.1.3", risk_level: "high", question: "Is training provided for personnel in POI environments to be aware of attempted tampering or replacement of POI devices?" },
      ]
    },
    {
      id: "R10", number: "10", title: "Logging & Monitoring", weight: 8,
      controls: [
        { id: "R10-C1", ref: "10.1.1", risk_level: "high", question: "Are all security policies and operational procedures for logging and monitoring documented, in use, and known to all affected parties?" },
        { id: "R10-C2", ref: "10.1.2", risk_level: "high", question: "Are roles and responsibilities for logging and monitoring assigned, documented, and understood?" },
        { id: "R10-C3", ref: "10.2.1", risk_level: "critical", question: "Are audit logs enabled and active for all system components in scope for PCI DSS?" },
        { id: "R10-C4", ref: "10.2.1.1", risk_level: "critical", question: "Do audit logs capture all individual user access to cardholder data?" },
        { id: "R10-C5", ref: "10.2.1.2", risk_level: "critical", question: "Do audit logs capture all actions taken by any individual with root or administrative privileges?" },
        { id: "R10-C6", ref: "10.2.1.3", risk_level: "high", question: "Do audit logs capture all access to audit logs?" },
        { id: "R10-C7", ref: "10.2.1.4", risk_level: "high", question: "Do audit logs capture all invalid logical access attempts?" },
        { id: "R10-C8", ref: "10.2.1.5", risk_level: "high", question: "Do audit logs capture all changes to identification and authentication mechanisms, including creation of new accounts and elevation of privileges?" },
        { id: "R10-C9", ref: "10.2.1.6", risk_level: "high", question: "Do audit logs capture all initialisation, stopping, or pausing of audit logs, and all changes to audit log configuration?" },
        { id: "R10-C10", ref: "10.2.1.7", risk_level: "high", question: "Do audit logs capture all creation and deletion of system-level objects?" },
        { id: "R10-C11", ref: "10.2.2", risk_level: "high", question: "Do audit logs capture sufficient details including user ID, event type, date/time, success or failure, origination, and identity of affected data or resource?" },
        { id: "R10-C12", ref: "10.3.1", risk_level: "critical", question: "Is read access to audit log files limited to those with a job-related need, with logs protected from destruction and unauthorised modifications?" },
        { id: "R10-C13", ref: "10.3.2", risk_level: "high", question: "Are audit log files protected from modification by individuals, with controls preventing unauthorised changes to log data?" },
        { id: "R10-C14", ref: "10.3.3", risk_level: "critical", question: "Are audit log files backed up promptly to a centralised log server or media that is difficult to alter?" },
        { id: "R10-C15", ref: "10.3.4", risk_level: "high", question: "Are file integrity monitoring or change detection tools used on audit logs to ensure existing log data cannot be changed without generating alerts?" },
        { id: "R10-C16", ref: "10.4.1", risk_level: "high", question: "Are logs from all system components reviewed at least once daily via automated or manual processes?" },
        { id: "R10-C17", ref: "10.4.1.1", risk_level: "high", question: "Are automated mechanisms used to perform audit log reviews and generate alerts on anomalies?" },
        { id: "R10-C18", ref: "10.4.2", risk_level: "high", question: "Are logs of all other system components not specified in 10.4.1 reviewed periodically based on the organisation's policies and risk management strategy?" },
        { id: "R10-C19", ref: "10.4.2.1", risk_level: "medium", question: "Is the frequency of periodic log reviews for all other system components defined in the entity's targeted risk analysis?" },
        { id: "R10-C20", ref: "10.4.3", risk_level: "high", question: "Are exceptions and anomalies identified during log review addressed in a timely manner?" },
        { id: "R10-C21", ref: "10.5.1", risk_level: "critical", question: "Are audit logs retained for at least 12 months with at least the last three months available for immediate analysis?" },
        { id: "R10-C22", ref: "10.6.1", risk_level: "high", question: "Are system clocks and time on all critical systems synchronised using time-synchronisation technology?" },
        { id: "R10-C23", ref: "10.6.2", risk_level: "high", question: "Are systems configured to acquire correct time from designated internal or external time sources, with time settings distributed consistently across all systems?" },
        { id: "R10-C24", ref: "10.6.3", risk_level: "high", question: "Are time synchronisation settings and data protected — with access to time data restricted and changes to time settings logged, monitored, and reviewed?" },
        { id: "R10-C25", ref: "10.7.1", risk_level: "high", question: "For service providers only: Are failures of critical security controls detected, alerted, and reported promptly, including failures of firewalls, IDS/IPS, FIM, anti-malware, and audit logging?" },
        { id: "R10-C26", ref: "10.7.2", risk_level: "high", question: "Are failures of critical security control systems detected, alerted, and addressed promptly?" },
        { id: "R10-C27", ref: "10.7.3", risk_level: "high", question: "Are failures of critical security control systems responded to promptly — including restoring controls, identifying cause, and implementing remediation to prevent recurrence?" },
      ]
    },
    {
      id: "R11", number: "11", title: "Security Testing", weight: 9,
      controls: [
        { id: "R11-C1", ref: "11.1.1", risk_level: "high", question: "Are all security policies and operational procedures for security testing documented, in use, and known to all affected parties?" },
        { id: "R11-C2", ref: "11.1.2", risk_level: "high", question: "Are roles and responsibilities for security testing assigned, documented, and understood?" },
        { id: "R11-C3", ref: "11.2.1", risk_level: "high", question: "Are authorised and unauthorised wireless access points managed, with rogue wireless detection performed at least once every three months?" },
        { id: "R11-C4", ref: "11.2.2", risk_level: "high", question: "Is an inventory of authorised wireless access points maintained, including a documented business justification for each?" },
        { id: "R11-C5", ref: "11.3.1", risk_level: "critical", question: "Are internal vulnerability scans performed at least once every three months and after any significant changes to the environment?" },
        { id: "R11-C6", ref: "11.3.1.1", risk_level: "critical", question: "Are all high-risk and critical vulnerabilities from internal scans resolved and rescans performed to confirm remediation?" },
        { id: "R11-C7", ref: "11.3.1.2", risk_level: "high", question: "Are internal vulnerability scans performed using authenticated scanning where system components allow for it?" },
        { id: "R11-C8", ref: "11.3.1.3", risk_level: "high", question: "Are internal vulnerability scans performed by qualified personnel with organisational independence from the systems being scanned?" },
        { id: "R11-C9", ref: "11.3.2", risk_level: "critical", question: "Are external vulnerability scans performed at least once every three months by an Approved Scanning Vendor (ASV)?" },
        { id: "R11-C10", ref: "11.3.2.1", risk_level: "critical", question: "Are external vulnerability scans performed after any significant change, with rescans until passing results are achieved?" },
        { id: "R11-C11", ref: "11.4.1", risk_level: "critical", question: "Is a penetration testing methodology defined and documented, based on industry-accepted approaches such as NIST SP800-115, OWASP, PTES, or OSSTMM?" },
        { id: "R11-C12", ref: "11.4.2", risk_level: "critical", question: "Is internal penetration testing performed at least once every 12 months and after any significant change to the environment?" },
        { id: "R11-C13", ref: "11.4.3", risk_level: "critical", question: "Is external penetration testing performed at least once every 12 months and after any significant change to the environment?" },
        { id: "R11-C14", ref: "11.4.4", risk_level: "critical", question: "Are exploitable vulnerabilities and security weaknesses found during penetration testing corrected, with retesting performed to verify corrections?" },
        { id: "R11-C15", ref: "11.4.5", risk_level: "high", question: "If segmentation is used to isolate the CDE, are penetration tests performed on segmentation controls at least once every 12 months to verify the CDE is effectively isolated?" },
        { id: "R11-C16", ref: "11.4.6", risk_level: "high", question: "For service providers only: If segmentation is used, are penetration tests on segmentation controls performed at least once every six months?" },
        { id: "R11-C17", ref: "11.4.7", risk_level: "high", question: "For multi-tenant service providers only: Is external penetration testing support provided to customers in accordance with PCI DSS requirements?" },
        { id: "R11-C18", ref: "11.5.1", risk_level: "high", question: "Is intrusion-detection and/or intrusion-prevention technology deployed to detect and/or prevent intrusions into the network?" },
        { id: "R11-C19", ref: "11.5.1.1", risk_level: "high", question: "For service providers only: Is intrusion-detection or prevention technology deployed to detect covert malware communication channels, including outbound DNS tunneling?" },
        { id: "R11-C20", ref: "11.5.2", risk_level: "high", question: "Is a change-detection mechanism (e.g. file integrity monitoring) deployed to alert personnel to unauthorised modification of critical files, configuration files, and content files?" },
        { id: "R11-C21", ref: "11.6.1", risk_level: "critical", question: "Is a change and tamper-detection mechanism deployed to alert on unauthorised modification of HTTP headers and payment page scripts in the consumer's browser?" },
      ]
    },
    {
      id: "R12", number: "12", title: "Security Policies & Programs", weight: 7,
      controls: [
        { id: "R12-C1", ref: "12.1.1", risk_level: "high", question: "Is an overall information security policy established, published, maintained, and disseminated to all relevant personnel including vendors and business partners?" },
        { id: "R12-C2", ref: "12.1.2", risk_level: "high", question: "Is the information security policy reviewed at least once every 12 months and updated when the environment changes?" },
        { id: "R12-C3", ref: "12.1.3", risk_level: "high", question: "Does the information security policy clearly define information security roles and responsibilities for all personnel?" },
        { id: "R12-C4", ref: "12.1.4", risk_level: "high", question: "Is responsibility for information security formally assigned to a CISO or other information-security-knowledgeable member of executive management?" },
        { id: "R12-C5", ref: "12.2.1", risk_level: "high", question: "Are acceptable use policies for end-user technologies documented, implemented, and signed off by authorised parties?" },
        { id: "R12-C6", ref: "12.3.2", risk_level: "high", question: "Is a targeted risk analysis performed for each PCI DSS requirement met via the customised approach, including documentation of controls, risks, and how the objective is met?" },
        { id: "R12-C7", ref: "12.3.3", risk_level: "high", question: "Are all cryptographic cipher suites and protocols in use documented and reviewed at least once every 12 months?" },
        { id: "R12-C8", ref: "12.3.4", risk_level: "high", question: "Are hardware and software technologies reviewed at least once every 12 months to confirm they continue to receive security fixes from vendors?" },
        { id: "R12-C9", ref: "12.4.1", risk_level: "high", question: "For service providers only: Is executive management responsible for the protection of cardholder data and for establishing a PCI DSS compliance programme?" },
        { id: "R12-C10", ref: "12.4.2", risk_level: "high", question: "For service providers only: Are reviews performed at least once every three months to confirm personnel are following security policies and operational procedures?" },
        { id: "R12-C11", ref: "12.4.2.1", risk_level: "high", question: "For service providers only: Are reviews performed by personnel other than those responsible for performing the reviewed activity, with results reviewed and signed off by management?" },
        { id: "R12-C12", ref: "12.5.1", risk_level: "high", question: "Is an inventory of system components in scope for PCI DSS maintained, including a description of function or use for each?" },
        { id: "R12-C13", ref: "12.5.2", risk_level: "high", question: "Is the PCI DSS scope confirmed at least once every 12 months and upon significant changes, with results documented for QSA review?" },
        { id: "R12-C14", ref: "12.5.2.1", risk_level: "high", question: "For service providers only: Is the PCI DSS scope confirmed at least once every six months and after significant changes?" },
        { id: "R12-C15", ref: "12.5.3", risk_level: "high", question: "For service providers only: Do significant changes to organisational structure result in a documented review of the impact to PCI DSS scope and applicable controls?" },
        { id: "R12-C16", ref: "12.6.1", risk_level: "high", question: "Is a formal security awareness programme in place to make all personnel aware of the information security policy and their responsibilities?" },
        { id: "R12-C17", ref: "12.6.2", risk_level: "high", question: "Is the security awareness programme reviewed at least once every 12 months and updated to address new threats and vulnerabilities?" },
        { id: "R12-C18", ref: "12.6.3", risk_level: "high", question: "Do personnel receive security awareness training upon hire and at least once every 12 months, with acknowledgement that they have read and understood the security policy?" },
        { id: "R12-C19", ref: "12.6.3.2", risk_level: "medium", question: "Does security awareness training include awareness about the acceptable use of end-user technologies in accordance with Requirement 12.2.1?" },
        { id: "R12-C20", ref: "12.7.1", risk_level: "medium", question: "Are potential personnel who will have access to the CDE screened prior to hire, within the constraints of local laws, to minimise the risk of insider attacks?" },
        { id: "R12-C21", ref: "12.8.1", risk_level: "critical", question: "Is a list of all TPSPs maintained including description of services provided and which PCI DSS requirements they are responsible for?" },
        { id: "R12-C22", ref: "12.8.2", risk_level: "critical", question: "Are written agreements maintained with all TPSPs acknowledging their responsibility for securing cardholder data they possess or could impact?" },
        { id: "R12-C23", ref: "12.8.3", risk_level: "high", question: "Is there an established process for engaging TPSPs including proper due diligence prior to engagement?" },
        { id: "R12-C24", ref: "12.8.4", risk_level: "critical", question: "Is the PCI DSS compliance status of all TPSPs monitored at least once every 12 months?" },
        { id: "R12-C25", ref: "12.8.5", risk_level: "high", question: "Is information maintained about which PCI DSS requirements are managed by each TPSP, which by the entity, and which are shared?" },
        { id: "R12-C26", ref: "12.9.1", risk_level: "high", question: "For service providers only: Is a written acknowledgement provided to customers that the TPSP is responsible for the security of cardholder data it possesses or could impact?" },
        { id: "R12-C27", ref: "12.9.2", risk_level: "high", question: "For service providers only: Do TPSPs support customer requests for information about the TPSP's PCI DSS compliance status and shared responsibility matrix?" },
        { id: "R12-C28", ref: "12.10.1", risk_level: "critical", question: "Is an incident response plan implemented ready to activate in the event of a system breach, including defined roles, communication trees, legal notification, and containment procedures?" },
        { id: "R12-C29", ref: "12.10.2", risk_level: "high", question: "Is the incident response plan reviewed and tested at least once every 12 months, including all elements listed in Requirement 12.10.1?" },
        { id: "R12-C30", ref: "12.10.3", risk_level: "high", question: "Is specific personnel designated and available 24/7 to respond to suspected or confirmed security incidents?" },
        { id: "R12-C31", ref: "12.10.4", risk_level: "high", question: "Is personnel who will respond to security incidents appropriately and regularly trained on incident response procedures?" },
        { id: "R12-C32", ref: "12.10.4.1", risk_level: "medium", question: "Is the frequency of periodic training for incident response personnel defined in the entity's targeted risk analysis?" },
        { id: "R12-C33", ref: "12.10.5", risk_level: "high", question: "Does the incident response plan include alerts from security monitoring systems including IDS/IPS, WAF, FIM, and change-detection solutions?" },
        { id: "R12-C34", ref: "12.10.6", risk_level: "high", question: "Is the incident response plan modified and evolved based on lessons learnt and to incorporate industry developments?" },
        { id: "R12-C35", ref: "12.10.7", risk_level: "high", question: "Are incident response procedures in place that can be initiated upon detection of stored PAN anywhere it is not expected?" },
      ]
    }
  ]
};

const SCORES = { FULLY: 2, PARTIAL: 1, NOT: 0, NA: null };
const RISK_COLOR = { critical: "#FF4D4D", high: "#FF8C42", medium: "#FFD166", low: "#06D6A0" };
const SCORE_OPTIONS = [
  { value: "FULLY", label: "Fully Implemented", color: "#06D6A0", icon: "✓" },
  { value: "PARTIAL", label: "Partially Implemented", color: "#FFD166", icon: "◑" },
  { value: "NOT", label: "Not Implemented", color: "#FF4D4D", icon: "✗" },
  { value: "NA", label: "Not Applicable", color: "#6B7280", icon: "—" },
];

export default function PCIGapAssessment() {
  const [activeReq, setActiveReq] = useState(0);
  const [answers, setAnswers] = useState({});
  const [phase, setPhase] = useState("assess");
  const [orgName, setOrgName] = useState("");
  const [started, setStarted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => { setTimeout(() => setAnimateIn(true), 100); }, []);

  const totalControls = SAQ_DATA.requirements.reduce((s, r) => s + r.controls.length, 0);
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalControls) * 100;

  function setAnswer(controlId, value) {
    setAnswers(prev => ({ ...prev, [controlId]: value }));
  }

  function calcReqScore(req) {
    let total = 0, earned = 0, applicable = 0;
    for (const c of req.controls) {
      const ans = answers[c.id];
      if (ans === "NA" || ans === undefined) continue;
      applicable++;
      total += 2;
      earned += SCORES[ans] || 0;
    }
    return applicable === 0 ? null : Math.round((earned / total) * 100);
  }

  function calcOverallScore() {
    let weightedSum = 0, totalWeight = 0;
    for (const req of SAQ_DATA.requirements) {
      const score = calcReqScore(req);
      if (score !== null) {
        weightedSum += score * req.weight;
        totalWeight += req.weight;
      }
    }
    return totalWeight === 0 ? 0 : Math.round(weightedSum / totalWeight);
  }

  function getGapControls() {
    const gaps = [];
    for (const req of SAQ_DATA.requirements) {
      for (const c of req.controls) {
        const ans = answers[c.id];
        if (ans === "NOT" || ans === "PARTIAL") {
          gaps.push({ ...c, reqTitle: req.title, reqNumber: req.number, status: ans });
        }
      }
    }
    return gaps.sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      return (order[a.risk_level] ?? 4) - (order[b.risk_level] ?? 4);
    });
  }

  function scoreColor(s) {
    if (s >= 80) return "#06D6A0";
    if (s >= 60) return "#FFD166";
    if (s >= 40) return "#FF8C42";
    return "#FF4D4D";
  }

  function scoreLabel(s) {
    if (s >= 80) return "STRONG";
    if (s >= 60) return "DEVELOPING";
    if (s >= 40) return "WEAK";
    return "CRITICAL GAP";
  }

  function hexToRgb(hex) {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? [parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16)] : [255, 255, 255];
  }

  function downloadPDF() {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const overall = calcOverallScore();
    const gaps = getGapControls();
    const margin = 20, contentW = 170;
    let y = 0;
    const chk = (n = 10) => { if (y + n > 270) { doc.addPage(); y = 20; } };

    doc.setFillColor(10, 14, 26); doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(91, 155, 213); doc.setFontSize(8); doc.setFont("helvetica", "bold");
    doc.text("PCI DSS v4.0.1 — Complete Assessment", margin, 14);
    doc.setTextColor(232, 237, 245); doc.setFontSize(18);
    doc.text("Payment Security Gap Assessment", margin, 26);
    doc.setTextColor(90, 106, 122); doc.setFontSize(8); doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, margin, 34);

    y = 52;
    doc.setFillColor(15, 21, 37); doc.roundedRect(margin, y, contentW, 28, 3, 3, "F");
    doc.setTextColor(91, 155, 213); doc.setFontSize(8); doc.setFont("helvetica", "bold");
    doc.text("ORGANISATION", margin + 6, y + 8);
    doc.setTextColor(232, 237, 245); doc.setFontSize(13);
    doc.text(orgName || "Your Organisation", margin + 6, y + 17);
    const cx = margin + contentW - 20, cy = y + 14;
    const [r2, g2, b2] = hexToRgb(scoreColor(overall));
    doc.setFillColor(r2, g2, b2); doc.circle(cx, cy, 12, "F");
    doc.setFillColor(15, 21, 37); doc.circle(cx, cy, 9, "F");
    doc.setTextColor(r2, g2, b2); doc.setFontSize(8); doc.setFont("helvetica", "bold");
    doc.text(`${overall}%`, cx, cy + 2.5, { align: "center" });
    y += 36;

    const [sr, sg, sb] = hexToRgb(scoreColor(overall));
    doc.setTextColor(sr, sg, sb); doc.setFontSize(20); doc.setFont("helvetica", "bold");
    doc.text(scoreLabel(overall), margin, y); y += 7;
    doc.setTextColor(90, 106, 122); doc.setFontSize(8); doc.setFont("helvetica", "normal");
    doc.text(`${gaps.filter(g => g.risk_level === "critical").length} critical gaps  ·  ${gaps.length} total gaps  ·  ${answeredCount}/${totalControls} controls assessed`, margin, y);
    y += 12;

    doc.setDrawColor(30, 45, 64); doc.line(margin, y, margin + contentW, y); y += 10;
    doc.setTextColor(232, 237, 245); doc.setFontSize(9); doc.setFont("helvetica", "bold");
    doc.text("REQUIREMENT BREAKDOWN", margin, y); y += 6;

    for (const req of SAQ_DATA.requirements) {
      chk(10);
      const score = calcReqScore(req);
      const [cr, cg, cb] = score !== null ? hexToRgb(scoreColor(score)) : [90, 106, 122];
      doc.setFillColor(15, 21, 37); doc.roundedRect(margin, y, contentW, 8, 1, 1, "F");
      doc.setTextColor(91, 155, 213); doc.setFontSize(7); doc.setFont("helvetica", "bold");
      doc.text(`REQ ${req.number}`, margin + 3, y + 5.5);
      doc.setTextColor(200, 213, 224); doc.setFont("helvetica", "normal");
      doc.text(req.title, margin + 20, y + 5.5);
      doc.setTextColor(cr, cg, cb); doc.setFont("helvetica", "bold");
      doc.text(score !== null ? `${score}%` : "—", margin + contentW - 3, y + 5.5, { align: "right" });
      if (score !== null) {
        doc.setFillColor(26, 37, 53); doc.roundedRect(margin + contentW - 30, y + 3, 22, 2.5, 1, 1, "F");
        doc.setFillColor(cr, cg, cb); doc.roundedRect(margin + contentW - 30, y + 3, 22 * (score / 100), 2.5, 1, 1, "F");
      }
      y += 10;
    }

    y += 4; doc.setDrawColor(30, 45, 64); doc.line(margin, y, margin + contentW, y); y += 10;

    if (gaps.length > 0) {
      doc.setTextColor(232, 237, 245); doc.setFontSize(9); doc.setFont("helvetica", "bold");
      doc.text(`REMEDIATION PRIORITIES (${gaps.length} GAPS)`, margin, y); y += 8;
      for (const g of gaps) {
        const lines = doc.splitTextToSize(g.question, contentW - 40);
        const boxH = 8 + lines.length * 4.5;
        chk(boxH + 4);
        const [gr, gg, gb] = hexToRgb(RISK_COLOR[g.risk_level] || "#6B7280");
        doc.setFillColor(15, 21, 37); doc.roundedRect(margin, y, contentW, boxH, 2, 2, "F");
        doc.setFillColor(gr, gg, gb); doc.roundedRect(margin, y, 3, boxH, 1, 1, "F");
        doc.setTextColor(gr, gg, gb); doc.setFontSize(6.5); doc.setFont("helvetica", "bold");
        doc.text(g.risk_level.toUpperCase(), margin + 7, y + 5);
        doc.setTextColor(90, 106, 122); doc.setFont("helvetica", "normal");
        doc.text(`Req ${g.reqNumber} · ${g.ref}`, margin + 30, y + 5);
        const [str, stg, stb] = hexToRgb(g.status === "NOT" ? "#FF4D4D" : "#FFD166");
        doc.setTextColor(str, stg, stb);
        doc.text(g.status === "NOT" ? "NOT IMPLEMENTED" : "PARTIAL", margin + contentW - 3, y + 5, { align: "right" });
        doc.setTextColor(200, 213, 224); doc.setFontSize(7.5);
        doc.text(lines, margin + 7, y + 11);
        y += boxH + 4;
      }
    }

    const pc = doc.getNumberOfPages();
    for (let i = 1; i <= pc; i++) {
      doc.setPage(i);
      doc.setFillColor(10, 14, 26); doc.rect(0, 285, 210, 12, "F");
      doc.setTextColor(90, 106, 122); doc.setFontSize(7); doc.setFont("helvetica", "normal");
      doc.text("PCI DSS v4.0.1 Gap Assessment  ·  Confidential  ·  No data stored or transmitted", margin, 291);
      doc.text(`Page ${i} of ${pc}`, 210 - margin, 291, { align: "right" });
    }

    doc.save(`PCI-DSS-v4.0.1-Gap-Report-${(orgName || "Assessment").replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  const req = SAQ_DATA.requirements[activeReq];

  if (!started) {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0E1A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", opacity: animateIn ? 1 : 0, transition: "opacity 0.8s ease" }}>
        <div style={{ textAlign: "center", maxWidth: 560, padding: "0 24px" }}>
          <div style={{ display: "inline-block", background: "linear-gradient(135deg, #1E3A5F, #0D2137)", border: "1px solid #2A4A6B", borderRadius: 4, padding: "6px 16px", color: "#5B9BD5", fontSize: 11, letterSpacing: 3, marginBottom: 32, textTransform: "uppercase", fontFamily: "monospace" }}>PCI DSS v4.0.1</div>
          <h1 style={{ fontSize: 42, fontWeight: 700, color: "#E8EDF5", lineHeight: 1.15, marginBottom: 16, letterSpacing: -1 }}>Payment Security<br /><span style={{ color: "#5B9BD5" }}>Gap Assessment</span></h1>
          <p style={{ color: "#7A8BA0", fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>Evaluate your organisation's compliance posture across all 12 PCI DSS v4.0.1 requirements. Receive a prioritised gap report in minutes.</p>
          <p style={{ color: "#3A5068", fontSize: 13, lineHeight: 1.6, marginBottom: 40, fontStyle: "italic" }}>No data is stored or transmitted. This assessment runs entirely in your browser.</p>
          <div style={{ marginBottom: 40 }}>
            <input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Organisation name (optional)"
              style={{ width: "100%", padding: "14px 18px", background: "#0F1525", border: "1px solid #2A3A50", borderRadius: 6, color: "#E8EDF5", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
          </div>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 48 }}>
            {[["12", "Requirements"], [String(totalControls), "Controls"], ["~90 min", "Duration"]].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#5B9BD5" }}>{val}</div>
                <div style={{ fontSize: 12, color: "#5A6A7A", textTransform: "uppercase", letterSpacing: 1 }}>{lbl}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setStarted(true)} style={{ background: "#1E56A0", color: "#fff", border: "none", borderRadius: 6, padding: "16px 48px", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5 }}
            onMouseOver={e => e.target.style.background = "#2563B0"} onMouseOut={e => e.target.style.background = "#1E56A0"}>Begin Assessment →</button>
        </div>
      </div>
    );
  }

  if (phase === "results") {
    const overall = calcOverallScore();
    const gaps = getGapControls();
    const criticalGaps = gaps.filter(g => g.risk_level === "critical");
    return (
      <div style={{ minHeight: "100vh", background: "#0A0E1A", fontFamily: "'Georgia', serif", padding: "40px 24px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ color: "#5A6A7A", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Gap Assessment Report · PCI DSS v4.0.1</div>
              <h1 style={{ color: "#E8EDF5", fontSize: 28, fontWeight: 700, margin: 0 }}>{orgName || "Your Organisation"}</h1>
              <div style={{ color: "#5A6A7A", fontSize: 13, marginTop: 4 }}>{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setPhase("assess")} style={{ background: "transparent", border: "1px solid #2A3A50", color: "#7A8BA0", borderRadius: 6, padding: "10px 20px", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>← Back</button>
              <button onClick={() => { if(typeof ml !== 'undefined') ml('show', 'RCBSj5', true); downloadPDF(); }} style={{ background: "#1E56A0", border: "none", color: "#fff", borderRadius: 6, padding: "10px 24px", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600 }}
                onMouseOver={e => e.target.style.background = "#2563B0"} onMouseOut={e => e.target.style.background = "#1E56A0"}>↓ Download PDF Report</button>
            </div>
          </div>

          <div style={{ background: "#0F1525", border: "1px solid #2A3A50", borderRadius: 10, padding: 32, marginBottom: 32, display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ width: 100, height: 100, borderRadius: "50%", flexShrink: 0, background: `conic-gradient(${scoreColor(overall)} ${overall}%, #1A2535 0)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 78, height: 78, borderRadius: "50%", background: "#0F1525", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: scoreColor(overall) }}>{overall}%</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#5A6A7A", letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace" }}>Overall Compliance Score</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: scoreColor(overall), marginTop: 4 }}>{scoreLabel(overall)}</div>
              <div style={{ color: "#7A8BA0", fontSize: 14, marginTop: 6 }}>{criticalGaps.length} critical gaps · {gaps.length - criticalGaps.length} other gaps · {answeredCount}/{totalControls} controls assessed</div>
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ color: "#E8EDF5", fontSize: 16, fontWeight: 600, marginBottom: 16, fontFamily: "monospace", letterSpacing: 1 }}>REQUIREMENT BREAKDOWN</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {SAQ_DATA.requirements.map(r => {
                const s = calcReqScore(r);
                return (
                  <div key={r.id} style={{ background: "#0F1525", border: "1px solid #2A3A50", borderRadius: 8, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, background: s !== null ? `conic-gradient(${scoreColor(s)} ${s}%, #1A2535 0)` : "#1A2535", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#0F1525", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: s !== null ? scoreColor(s) : "#5A6A7A", fontFamily: "monospace" }}>
                        {s !== null ? `${s}%` : "—"}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "#5B9BD5", fontSize: 11, fontFamily: "monospace" }}>Req {r.number}</div>
                      <div style={{ color: "#C8D5E0", fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{r.title}</div>
                      <div style={{ color: "#3A5068", fontSize: 10, fontFamily: "monospace", marginTop: 2 }}>{r.controls.length} controls</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {gaps.length > 0 && (
            <div>
              <h2 style={{ color: "#E8EDF5", fontSize: 16, fontWeight: 600, marginBottom: 16, fontFamily: "monospace", letterSpacing: 1 }}>REMEDIATION PRIORITIES ({gaps.length} GAPS)</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {gaps.map(g => (
                  <div key={g.id} style={{ background: "#0F1525", border: "1px solid #2A3A50", borderLeft: `3px solid ${RISK_COLOR[g.risk_level]}`, borderRadius: 8, padding: "14px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ background: RISK_COLOR[g.risk_level] + "22", color: RISK_COLOR[g.risk_level], fontSize: 10, fontFamily: "monospace", padding: "2px 8px", borderRadius: 3, textTransform: "uppercase", letterSpacing: 1 }}>{g.risk_level}</span>
                        <span style={{ color: "#5A6A7A", fontSize: 11, fontFamily: "monospace" }}>Req {g.reqNumber} · {g.ref}</span>
                      </div>
                      <span style={{ fontSize: 10, color: g.status === "NOT" ? "#FF4D4D" : "#FFD166", fontFamily: "monospace", letterSpacing: 1 }}>{g.status === "NOT" ? "NOT IMPLEMENTED" : "PARTIAL"}</span>
                    </div>
                    <div style={{ color: "#C8D5E0", fontSize: 13, lineHeight: 1.5 }}>{g.question}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {gaps.length === 0 && (
            <div style={{ background: "#0F1525", border: "1px solid #06D6A033", borderRadius: 10, padding: 32, textAlign: "center", color: "#06D6A0" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>No gaps identified</div>
              <div style={{ color: "#7A8BA0", marginTop: 8, fontSize: 14 }}>All assessed controls are fully implemented.</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0E1A", fontFamily: "'Georgia', serif", display: "flex" }}>
      <div style={{ width: 220, flexShrink: 0, background: "#0D1220", borderRight: "1px solid #1E2D40", padding: "24px 0", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "0 16px 20px", borderBottom: "1px solid #1E2D40", marginBottom: 8 }}>
          <div style={{ color: "#5B9BD5", fontSize: 10, letterSpacing: 2, fontFamily: "monospace", textTransform: "uppercase" }}>PCI DSS v4.0.1</div>
          <div style={{ color: "#E8EDF5", fontSize: 13, fontWeight: 600, marginTop: 4 }}>Gap Assessment</div>
          <div style={{ marginTop: 12, background: "#1A2535", borderRadius: 10, height: 4, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #1E56A0, #5B9BD5)", borderRadius: 10, transition: "width 0.4s ease" }} />
          </div>
          <div style={{ color: "#5A6A7A", fontSize: 11, marginTop: 6, fontFamily: "monospace" }}>{answeredCount}/{totalControls} answered</div>
        </div>
        {SAQ_DATA.requirements.map((r, i) => {
          const answered = r.controls.filter(c => answers[c.id] !== undefined).length;
          const isActive = i === activeReq;
          const score = calcReqScore(r);
          return (
            <button key={r.id} onClick={() => setActiveReq(i)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: isActive ? "#1A2D45" : "transparent", border: "none", borderLeft: isActive ? "2px solid #5B9BD5" : "2px solid transparent", cursor: "pointer", textAlign: "left" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: score !== null ? `conic-gradient(${scoreColor(score)} ${score}%, #1A2535 0)` : "#1A2535", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: isActive ? "#1A2D45" : "#0D1220", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontFamily: "monospace", fontWeight: 700, color: answered === r.controls.length ? "#5B9BD5" : "#5A6A7A" }}>{r.number}</div>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: isActive ? "#E8EDF5" : "#7A8BA0", fontSize: 12, fontWeight: isActive ? 600 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</div>
                <div style={{ color: "#3A5068", fontSize: 10, fontFamily: "monospace" }}>{answered}/{r.controls.length}</div>
              </div>
            </button>
          );
        })}
        <div style={{ marginTop: "auto", padding: 16 }}>
          <button onClick={() => setPhase("results")} style={{ width: "100%", background: "#1E56A0", color: "#fff", border: "none", borderRadius: 6, padding: "12px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>View Results →</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "36px 40px" }}>
        <div style={{ maxWidth: 680 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
            <div style={{ background: "#1E3A5F", color: "#5B9BD5", borderRadius: 4, padding: "3px 10px", fontSize: 11, fontFamily: "monospace", letterSpacing: 1 }}>REQ {req.number}</div>
            <div style={{ color: "#3A5068", fontSize: 12, fontFamily: "monospace" }}>{req.controls.filter(c => answers[c.id] !== undefined).length}/{req.controls.length} answered</div>
          </div>
          <h2 style={{ color: "#E8EDF5", fontSize: 24, fontWeight: 700, marginBottom: 8, marginTop: 0 }}>{req.title}</h2>
          <p style={{ color: "#5A6A7A", fontSize: 14, lineHeight: 1.6, marginBottom: 36 }}>{req.controls.length} controls · Weighted importance: {req.weight}/10</p>

          {req.controls.map((control) => {
            const answered = answers[control.id];
            return (
              <div key={control.id} style={{ background: "#0F1525", border: "1px solid", borderColor: answered ? "#2A4A6B" : "#1E2D40", borderRadius: 10, padding: "20px 24px", marginBottom: 16, transition: "border-color 0.2s" }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                  <span style={{ background: RISK_COLOR[control.risk_level] + "22", color: RISK_COLOR[control.risk_level], fontSize: 10, fontFamily: "monospace", padding: "2px 8px", borderRadius: 3, textTransform: "uppercase", letterSpacing: 1 }}>{control.risk_level}</span>
                  <span style={{ color: "#3A5068", fontSize: 11, fontFamily: "monospace" }}>{control.ref}</span>
                </div>
                <p style={{ color: "#C8D5E0", fontSize: 14, lineHeight: 1.65, marginBottom: 18, marginTop: 0 }}>{control.question}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {SCORE_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => setAnswer(control.id, opt.value)} style={{ padding: "8px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: answered === opt.value ? 600 : 400, border: `1px solid ${answered === opt.value ? opt.color : "#2A3A50"}`, background: answered === opt.value ? opt.color + "22" : "transparent", color: answered === opt.value ? opt.color : "#5A6A7A", transition: "all 0.15s" }}>
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <button onClick={() => setActiveReq(Math.max(0, activeReq - 1))} disabled={activeReq === 0}
              style={{ background: "transparent", border: "1px solid #2A3A50", color: "#7A8BA0", borderRadius: 6, padding: "12px 24px", cursor: activeReq === 0 ? "not-allowed" : "pointer", fontFamily: "inherit", fontSize: 14, opacity: activeReq === 0 ? 0.4 : 1 }}>← Previous</button>
            {activeReq < SAQ_DATA.requirements.length - 1 ? (
              <button onClick={() => setActiveReq(activeReq + 1)} style={{ background: "#1E56A0", color: "#fff", border: "none", borderRadius: 6, padding: "12px 24px", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600 }}>Next Requirement →</button>
            ) : (
              <button onClick={() => setPhase("results")} style={{ background: "#06D6A0", color: "#0A0E1A", border: "none", borderRadius: 6, padding: "12px 24px", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700 }}>Generate Report ✓</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
