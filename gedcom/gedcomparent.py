#!/usr/bin/python
# v. 0.2
# gedcomParseParents
"""
Parse a gedcom file into JSON for relationships between parents and children.
Strategy: TODO
"""

# import requirements
import gedcom # don't forget to build/install
import sys
import re
from parsedate import *

argIn = sys.argv[1]
argOut = sys.argv[2]
userId = sys.argv[3]

def main():

    gedfile = gedcom.parse(argIn)

    #  getFatherRelation(gedfile)
    #  getMotherRelation(gedfile)
    #  parseTime(gedfile)
    #  makeLength(gedfile)
    #  makeJSONobject(gedfile)
    writeToJSONfile(gedfile)
    

"""''''''''''''''''''''''''''''''''''''''''''''''''''''''"""
####################################################
# TODO: docs
#       Tests
####################################################
"""''''''''''''''''''''''''''''''''''''''''''''''''''''''"""

# note: AttributeError means that there are no records of that type for that person

def getParentRelation(filename):
    """
    get parent relations from the gedcom file and parse them into JSON

    # loop through people from the input file, store their records and return the list
    :returns: father relation
    :rtype: list
    """
    fRel = []
    mRel = []
    
    for person in filename.individuals:
        buildFather = ''

        # need both the child and parent ID or there's no point in creating a record.
        try:
            buildFather += '"child_id" : "' + person.id + '",\n'
            buildFather += '"parent_id" : "' + person.father.id + '",\n'

            # parsedate only needs to be called once for each date entered and contains two records
            try:
                startDate = parseDate(person.birth.date)
                buildFather += '"startDate" : "' + startDate[0] + '",\n'
                buildFather += '"approxStart" : "' + startDate[1] + '",\n'
            except AttributeError:
                pass

            try:
                endDate = parseDate(person.death.date)
                buildFather += '"endDate" : "' + endDate[0] + '",\n'
                buildFather += '"approxEnd" : "' + endDate[1] + '",\n'
            except AttributeError:
                pass

            buildFather += '"relationshipType" : "Father",\n'
            buildFather += '"subType" : "Biological",\n'
            buildFather += '"user_id" : "' + userId + '"\n'

            fRel.append(buildFather)

        except AttributeError:
            pass

        buildMother = ''

        # need both the child and parent ID or there's no point in creating a record.
        try:
            buildMother += '"child_id" : "' + person.id + '",\n'
            buildMother += '"parent_id" : "' + person.mother.id + '",\n'

            # parsedate only needs to be called once for each date entered and contains two records
            try:
                startDate = parseDate(person.birth.date)
                buildMother += '"startDate" : "' + startDate[0] + '",\n'
                buildMother += '"approxStart" : "' + startDate[1] + '",\n'
            except AttributeError:
                pass

            try:
                endDate = parseDate(person.death.date)
                buildMother += '"endDate" : "' + endDate[0] + '",\n'
                buildMother += '"approxEnd" : "' + endDate[1] + '",\n'
            except AttributeError:
                pass

            buildMother += '"relationshipType" : "Mother",\n'
            buildMother += '"subType" : "Biological",\n'
            buildMother += '"user_id" : "' + userId + '"\n'

            mRel.append(buildMother)

        except AttributeError:
            pass

    return fRel, mRel

def makeJSONobject(filename):
    """
    create and format the json string

    :returns: json formatted string based on the previous functions
    :rtype: string
    """
    fRel, mRel = getParentRelation(filename)
    if len(fRel) < len(mRel):
        length = len(fRel)
    else:
        length = len(mRel)
    
    json = ''
    json += '[ \n'
    for i in range(length):
        try:
            json += '{\n'
            json += fRel[i]
        except IndexError:
            pass

        if i == (length - 1) and not mRel[i]:
            json += '}\n'
        else:
            json += '},\n'

        try:
            json += '{\n'
            json += mRel[i]
        except IndexError:
            pass

        if i == (length - 1):
            json += '}\n'
        else:
            json += '},\n'

    json +=']'
    return json
        

def writeToJSONfile(filename):
    """
    write the created json object to the output file and save it
    """
    json = makeJSONobject(filename)
    f = open(argOut, "w") # create/open the output file
    f.write(json)
    f.close() # save

if __name__ == "__main__":
    main()
