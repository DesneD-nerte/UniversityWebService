import { Request, Response, NextFunction } from "express";
import CurrentLessons from "../models/CurrentLessons";
import Mark from "../models/Mark";
import User from "../models/User";
import MarkRepository from "../repositories/markRepository";

class MarkController {
    async GetMarks (req: Request, res: Response, next: NextFunction) {
        try {
            const marks = await MarkRepository.getMarks();
            console.log(marks);

            return res.json(marks);

        } catch(e) {
            console.log(e);

            return res.send(e);
        }
    }

    async SaveNewCurrentLesson (req: Request, res: Response, next: NextFunction) {
        const {appointmentData, newCurrentLesson} = req.body;

        const arrayOneGroupStudents = await User.find({groups: [appointmentData.groupId]});
        
        for (const oneStudent of arrayOneGroupStudents) {
            const markOneStudent = await MarkRepository.getAdditionalDataMarksOfOneStudent(oneStudent._id, appointmentData.lessonNameId);
            if(markOneStudent) {
                //
                const currentLessons = markOneStudent.allCurrentLessons;
                for (let i = currentLessons.length - 1; i >= 0; i--) {
                    if(currentLessons[i].currentLesson.beginDate < new Date(newCurrentLesson.beginDate)) {
                        markOneStudent.allCurrentLessons.splice(i + 1, 0, {currentLesson: newCurrentLesson._id, mark: ''}); 
                        
                        break;    
                    } 

                    if(i === 0) {
                        markOneStudent.allCurrentLessons.unshift({currentLesson: newCurrentLesson._id, mark: ''}); 
                    }
                }
                //
                // markOneStudent.allCurrentLessons.push({currentLesson: newCurrentLesson._id, mark: ''});
                await markOneStudent.save();
            } else {
                const newMark = new Mark({
                    user: oneStudent._id,
                    lesson: appointmentData.lessonNameId,
                    allCurrentLessons: [{currentLesson: newCurrentLesson._id, mark: ''}]
                })

                await newMark.save();
            }
        }

        return res.sendStatus(200);
    }

    async SaveNewArrayCurrentLessons(req: Request, res: Response, next: NextFunction) {
        const {appointmentData, newCurrentLessonsArray} = req.body;

        const arrayOneGroupStudents = await User.find({groups: [appointmentData.groupId]});
        
        // const arrayMarks: Array<typeof Mark> = []

        for (const oneStudent of arrayOneGroupStudents) {
            let markOneStudent = await Mark.findOne({user: oneStudent._id, lesson: appointmentData.lessonNameId})

            for (const newCurrentLesson of newCurrentLessonsArray) {
                if(markOneStudent) {
                    markOneStudent.allCurrentLessons.push({currentLesson: newCurrentLesson._id, mark: ''});
                    await markOneStudent.save();
                    // arrayMarks.push(markOneStudent);
                } else {
                    markOneStudent = new Mark({
                        user: oneStudent._id,
                        lesson: appointmentData.lessonNameId,
                        allCurrentLessons: [{currentLesson: newCurrentLesson._id, mark: ''}]
                    })
    
                    await markOneStudent.save();
                    // arrayMarks.push(markOneStudent);
                }   
            }

        }

        return res.sendStatus(200);
    }

    async UpdateCurrentLesson(req: Request, res: Response, next: NextFunction) {
        const existedMark = req.body;

        await Mark.findOneAndUpdate({_id: existedMark._id}, existedMark);

        return res.sendStatus(200);
    }
}

export default new MarkController();