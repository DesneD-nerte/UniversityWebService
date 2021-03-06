import axios, { AxiosResponse } from "axios";
import { 
    AudienceLessonScheduler,
    CurrentLesson,
    CurrentLessonScheduler,
    GroupLessonScheduler,
    InformationScheduler,
    LessonLessonScheduler,
    TeacherLessonScheduler 
} from "../../types";

const endpoint = process.env.REACT_APP_SERVICE_URI;

class DataService {

    GetMainInformation () : Promise<InformationScheduler> {

        const requestTeachers = axios.get(`${endpoint}/users/teachers/`);
        const requestAudiences = axios.get(`${endpoint}/api/audiences/`);
        const requestLessonsNames = axios.get(`${endpoint}/api/lessons/`);
        const requestGroups = axios.get(`${endpoint}/api/groups/`);

        const newInformationScheduler = axios.all([requestTeachers, requestAudiences, requestLessonsNames, requestGroups])
        .then(axios.spread((...response) => {
            const responseTeachers = response[0];
            const responseAudiences = response[1];
            const responseLessonsNames = response[2];
            const responseGroups= response[3];

            let newArrayTeachers: Array<TeacherLessonScheduler> = [];
            for (const oneTeacher of responseTeachers.data) {
                newArrayTeachers.push({id: oneTeacher._id, text: oneTeacher.name, email: oneTeacher.email});
            }

            let newArrayAudiences: Array<AudienceLessonScheduler> = [];
            for (const oneAudience of responseAudiences.data) {
                newArrayAudiences.push({id: oneAudience._id, text: oneAudience.name});
            }

            let newArrayLessonsNames: Array<LessonLessonScheduler> = [];
            for (const oneLessonName of responseLessonsNames.data) {
                newArrayLessonsNames.push({id: oneLessonName._id, text: oneLessonName.name});
            }

            let newArrayGroups: Array<GroupLessonScheduler> = [];
            for (const oneGroup of responseGroups.data) {
                newArrayGroups.push({id: oneGroup._id, text: oneGroup.name});
            }

            const newInformationScheduler: InformationScheduler = {
                teachers: newArrayTeachers,
                audiences: newArrayAudiences, 
                lessonsName: newArrayLessonsNames,
                groups: newArrayGroups
            };
            return newInformationScheduler;

        }))
        .catch(error => {
            console.log(error);

            const emptyInformationScheduler: InformationScheduler = {
                teachers: [],
                audiences: [],
                lessonsName: [],
                groups: [],
            };
            return emptyInformationScheduler;
        })

        return newInformationScheduler;
    }

    GetCurrentLessons () : Promise<CurrentLessonScheduler[]> {

        const newCurrentLessonPromise = axios.get(`${endpoint}/currentlessons`)
        .then(response => {
            const responseArrayLessons = response.data;

            const arrayScheduler = this.#fillArrayScheduler(responseArrayLessons);

            return arrayScheduler;
        })

        return newCurrentLessonPromise;
    }

    async TransformCurrentLessonsDbToScheduler(currentLessonsDb: Array<CurrentLesson>) {
        const currentLessonDbIdArray: Array<string> = [];

        for(const lesson of currentLessonsDb) {
            currentLessonDbIdArray.push(lesson._id);
        }

        const responseArrayLessons: Array<CurrentLesson> = await (await axios.put(`${endpoint}/currentlessons/schedulercurrentlessons`, {data: currentLessonDbIdArray})).data;
        
        const arrayScheduler = this.#fillArrayScheduler(responseArrayLessons);

        return arrayScheduler;
    }

    
    #fillArrayScheduler(responseArrayLessons: Array<any>) {
        const newCurrentLessons: Array<CurrentLessonScheduler> = [];

        for(const oneLesson of responseArrayLessons) {
            newCurrentLessons.push(this.#changeObjectKeyNames(oneLesson));
        }

        return newCurrentLessons;
    }

    #changeObjectKeyNames(oneLessonDb) {
        const teachersId: Array<string> = [];
        for (const oneTeacher of oneLessonDb.teachers) {
            teachersId.push(oneTeacher._id);
        }

        return {
            _id: oneLessonDb._id,
            classRoomId: oneLessonDb.classroom._id,
            endDate: new Date(oneLessonDb.endDate),
            startDate: new Date(oneLessonDb.beginDate),
            teacherId: teachersId,
            text: oneLessonDb.name.name,
            lessonNameId: oneLessonDb.name._id,
            groupId: oneLessonDb.group._id
        }
    }
}

export default new DataService();